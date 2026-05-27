import styles from './Notifications.module.css';

export const Notifications = () => {
  // Data dummy notifikasi estetik bergaya monochrome
  const notifications = [
    { id: 1, type: 'like', user: 'budi_crypto', target: 'postingan Teknologi Anda', time: '2j yang lalu' },
    { id: 2, type: 'comment', user: 'siti_kuliner', target: '"Rekomendasi burger premium..."', time: '5j yang lalu' },
    { id: 3, type: 'premium', user: 'Yappier Team', target: 'Selamat datang di ekosistem baru!', time: '1h yang lalu' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {notifications.map(item => (
          <div key={item.id} className={styles.item}>
            <div className={styles.avatar}>
              {item.type === 'like' && '✦'}
              {item.type === 'comment' && '💬'}
              {item.type === 'premium' && '⚡'}
            </div>
            <div className={styles.body}>
              <p className={styles.text}>
                <strong>{item.user}</strong> {item.type === 'like' ? 'menyukai' : item.type === 'comment' ? 'membalas' : 'memberikan info:'} {item.target}
              </p>
              <span className={styles.time}>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};