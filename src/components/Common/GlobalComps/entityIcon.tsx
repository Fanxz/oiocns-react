import React from 'react';
import { Avatar, Spin } from 'antd';
import orgCtrl from '@/ts/controller';
import { ShareIcon } from '@/ts/base/model';
import { command, parseAvatar, schema } from '@/ts/base';
import TypeIcon from './typeIcon';
import useAsyncLoad from '@/hooks/useAsyncLoad';
import { ImInfo } from '@/icons/im';

interface teamTypeInfo {
  size?: number;
  entityId?: string;
  entity?: schema.XEntity;
  typeName?: string;
  notAvatar?: boolean;
  title?: string;
  showName?: boolean;
}

interface shareIconInfo extends teamTypeInfo {
  share?: ShareIcon;
}

/** 实体图标 */
const EntityIcon = (info: teamTypeInfo) => {
  if (info.entity) {
    return (
      <ShareIconItem
        {...info}
        share={{
          name: info.entity.name,
          typeName: info.entity.typeName,
          avatar: parseAvatar(info.entity.icon),
        }}
      />
    );
  }
  return <ShareIconById {...info} />;
};

/** 实体ID查找 */
const ShareIconById = (info: shareIconInfo) => {
  if (info.entityId) {
    const [loaded, entity] = useAsyncLoad(
      () => orgCtrl.user.findEntityAsync(info.entityId!),
      [info.entityId],
    );
    if (!loaded) {
      return <Spin size="small" delay={10} />;
    }
    if (entity) {
      return (
        <ShareIconItem
          {...info}
          share={{
            name: entity.name,
            typeName: entity.typeName,
            avatar: parseAvatar(entity.icon),
          }}
        />
      );
    }
  }
  if (info.typeName) {
    return <ShareIconItem {...info} />;
  }
  return <></>;
};

/** 实体图标 */
const ShareIconItem = (info: shareIconInfo) => {
  const size = info.size ?? 22;
  const fontSize = size > 14 ? 14 : size;
  const infoMore = () => {
    if (info.entity && size > 18) {
      return (
        <span
          style={{
            position: 'relative',
            zIndex: 101,
            fontSize: 12,
            top: -8,
            width: 4,
          }}
          onClick={(e) => {
            e.stopPropagation();
            command.emitter('executor', 'open', info.entity, 'preview');
          }}>
          <ImInfo color={'#abc'} />
        </span>
      );
    }
    return <></>;
  };
  if (info.share) {
    if (info.share.avatar?.thumbnail) {
      return (
        <div
          style={{ cursor: 'pointer', display: 'flex' }}
          title={info.title ?? ''}
          onClick={() => {
            command.emitter('executor', 'open', info.entity, 'preview');
          }}>
          {infoMore()}
          <Avatar size={size} src={info.share.avatar.thumbnail} />
          {info.showName && (
            <strong style={{ marginLeft: 6, fontSize: fontSize }}>
              {info.share.name}
            </strong>
          )}
        </div>
      );
    } else {
      const icon = (
        <TypeIcon
          avatar
          iconType={info.share.typeName || info.typeName || '其它'}
          size={size}
        />
      );
      if (info.notAvatar) {
        return icon;
      }
      return (
        <div style={{ display: 'flex' }}>
          {infoMore()}
          <Avatar
            size={size}
            icon={icon}
            style={{ background: 'transparent', color: '#606060' }}
          />
          {info.showName && (
            <b style={{ marginLeft: 6, fontSize: fontSize }}>{info.share.name}</b>
          )}
        </div>
      );
    }
  }
  return (
    <div style={{ cursor: 'pointer', display: 'flex' }} title={info.title ?? ''}>
      {infoMore()}
      <Avatar
        size={size}
        icon={<TypeIcon avatar iconType={'其它'} size={size} />}
        style={{ background: 'transparent', color: '#606060' }}
      />
      {info.showName && (
        <strong style={{ marginLeft: 6, fontSize: fontSize }}>{info.entity?.id}</strong>
      )}
    </div>
  );
};

export default EntityIcon;
