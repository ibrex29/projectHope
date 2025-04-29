import { Injectable } from '@nestjs/common';
import { Action, Status } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import {
  OrphanSnapshotDto,
  SponsorshipRequestSnapshotDto,
} from 'src/dto/snapshot.dto';
import {
  CreateSponsorshipRequestDto,
  UpdateSponsorshipRequestDto,
} from 'src/modules/guardian/dto/create-sponsorship-request.dto';
import { Entity } from 'src/modules/guardian/dto/types.enum';
import { GuardianService } from 'src/modules/guardian/guardian.service';
import { UpdateOrphanDto } from 'src/modules/orphan/dto/update-orphan.dto';

const ActionStatusMap = {
  [Action.create]: Status.draft,
  [Action.approve]: Status.approved,
  [Action.close]: Status.closed,
  [Action.delete]: undefined,
  [Action.publish]: Status.published,
  [Action.reject]: Status.rejected,
  [Action.request_approval]: Status.approval_requested,
  [Action.request_edit]: Status.edit_requested,
  [Action.request_publish]: Status.publish_requested,
  [Action.reject_edit]: Status.edit_rejected,
  [Action.reject_publish]: Status.publish_rejected,
  [Action.approve_edit]: Status.edit_approved,
  [Action.approve_publish]: Status.published,
  [Action.request_reopen]: Status.reopen_requested,
  [Action.approve_reopen]: Status.reopened,
  [Action.reject_reopen]: Status.reopen_rejected,
  [Action.request_reopen_publish]: Status.reopen_publish_requested,
  [Action.approve_reopen_publish]: Status.published,
  [Action.reject_reopen_publish]: Status.reopen_publish_rejected,
};

@Injectable()
export class ActionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sponsorshipRequest: GuardianService,
  ) {}

  async performAction(
    entityId: string,
    userId: string,
    action: Action,
    entity: Entity,
    comment?: string,
    snapshot?: SponsorshipRequestSnapshotDto | OrphanSnapshotDto,
    change?:
      | CreateSponsorshipRequestDto
      | UpdateOrphanDto
      | UpdateSponsorshipRequestDto,
  ) {
    const prisma = this.prisma;
    const sponsorshipRequest = this.sponsorshipRequest;

    function findEntity() {
      const findOptions = {
        where: {
          id: entityId,
        },
      };
      return entity === Entity.Orphan
        ? prisma.orphan.findUnique(findOptions)
        : prisma.sponsorshipRequest.findUnique(findOptions);
    }

    async function createEntity() {
      return entity === Entity.Orphan
        ? undefined
        : await sponsorshipRequest.createSponsorshipRequest(
            change as CreateSponsorshipRequestDto,
            userId,
          );
    }

    async function editEntity(status?: Status) {
      return entity === Entity.Orphan
        ? undefined
        : await sponsorshipRequest.updateRequest(
            entityId,
            change as UpdateSponsorshipRequestDto,
            status,
          );
    }

    async function deleteEntity() {
      return entity === Entity.Orphan
        ? undefined
        : await sponsorshipRequest.deleteDraftRequest(entityId);
    }

    function changeStatus(status: Status) {
      const updateOptions = {
        where: {
          id: entityId,
        },
        data: {
          status: status,
          updatedByUserId: userId,
        },
      };
      return entity === Entity.Orphan
        ? prisma.orphan.update(updateOptions)
        : prisma.sponsorshipRequest.update(updateOptions);
    }

    function getActionFunction() {
      switch (action) {
        case Action.create:
          return createEntity();
        case Action.edit:
          return editEntity();
        case Action.approve_edit:
          return editEntity(ActionStatusMap[action]);
        case Action.delete:
          return deleteEntity();
        default:
          return changeStatus(ActionStatusMap[action]);
      }
    }

    const originalEntity = entityId ? await findEntity() : undefined;
    const resultingEntity = await getActionFunction().then((data) => data);

    const orphanId = entity === Entity.Orphan ? entityId : undefined;
    const sponsorshipRequestId = Entity.SponsorshipRequest
      ? Action.create
        ? resultingEntity.id
        : entityId
      : undefined;

    const fromStatus =
      action === Action.create ? undefined : originalEntity?.status;

    const toStatus =
      action === Action.create
        ? resultingEntity.status
        : action === Action.edit
          ? originalEntity?.status
          : ActionStatusMap[action];

    const transformedSnapshot = snapshot
      ? JSON.parse(JSON.stringify(snapshot))
      : undefined;
    const transformedChange = change
      ? JSON.parse(JSON.stringify(change))
      : undefined;

    await prisma.actionLog.create({
      data: {
        orphanId,
        sponsorshipRequestId,
        action,
        fromStatus,
        toStatus,
        snapshot: transformedSnapshot,
        change: transformedChange,
        comment,
        createdByUserId: userId,
      },
    });

    return resultingEntity;
  }
}
