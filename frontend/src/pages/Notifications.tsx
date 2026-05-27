import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import styles from './Notifications.module.css';

type NotifType = 'like' | 'comment' | 'follow';

interface NotificationData {
  id: string;
  type: NotifType;
  username: string;
  target?: string;
  time: string;
}

const DUMMY_NOTIFS: NotificationData[] = [
  { id: '1', type: 'like', username: 'Alex', target: 'your post', time: '5m' },
  { id: '2', type: 'follow', username: 'Satoshi', time: '1h' },
  { id: '3', type: 'comment', username: 'DesignerXYZ', target: 'your post', time: '2h' },
  { id: '4', type: 'like', username: 'Web3Dev', target: 'your post', time: '3h' }
];

export const Notifications = () => {
  const { user } = useAuth();
  const { t } = useI18n(user?.language as any);
  const [filter, setFilter] = useState<'all' | NotifType>('all');

  const filteredNotifs = DUMMY_NOTIFS.filter(n => filter === 'all' || n.type === filter);

  const getIcon = (type: NotifType) => {
    switch (type) {
      case 'like':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
          </svg>
        );
      case 'comment':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
          </svg>
        );
      case 'follow':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            <path d="M19 16v6" />
            <path d="M16 19h6" />
          </svg>
        );
    }
  };

  const getText = (n: NotificationData) => {
    switch (n.type) {
      case 'like': return <><span className={styles.username}>{n.username}</span> liked {n.target}</>;
      case 'comment': return <><span className={styles.username}>{n.username}</span> commented on {n.target}</>;
      case 'follow': return <><span className={styles.username}>{n.username}</span> started following you</>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterHeader}>
        <button 
          className={`${styles.filterPill} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          {t.notifications.all}
        </button>
        <button 
          className={`${styles.filterPill} ${filter === 'like' ? styles.active : ''}`}
          onClick={() => setFilter('like')}
        >
          {t.notifications.likes}
        </button>
        <button 
          className={`${styles.filterPill} ${filter === 'comment' ? styles.active : ''}`}
          onClick={() => setFilter('comment')}
        >
          {t.notifications.comments}
        </button>
        <button 
          className={`${styles.filterPill} ${filter === 'follow' ? styles.active : ''}`}
          onClick={() => setFilter('follow')}
        >
          {t.notifications.follows}
        </button>
      </div>

      {filteredNotifs.length > 0 ? (
        <div className={styles.list}>
          {filteredNotifs.map(n => (
            <div key={n.id} className={styles.item}>
              <div className={`${styles.iconWrapper} ${styles[n.type]}`}>
                {getIcon(n.type)}
              </div>
              <div className={styles.content}>
                <p className={styles.text}>{getText(n)}</p>
                <p className={styles.time}>{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>{t.notifications.empty}</p>
        </div>
      )}
    </div>
  );
};