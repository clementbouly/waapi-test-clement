import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styles from './App.module.css';
import { ActionList } from './components/actionsList.component';
import { QueueList } from './components/queueList.component';
import { ActionType } from './models/actions';
import { addActionToQueue } from './services/actions.service';

const socket = io('http://localhost:3000');

export const App = () => {
  const [actions, setActions] = useState<ActionType[]>([]);
  const [queue, setQueue] = useState<ActionType[]>([]);
  const [queueTimer, setQueueTimer] = useState<number | null>(null);

  useEffect(() => {
    // get all actions and queue on mount
    socket.emit('getAllActions');
    socket.emit('getQueue');

    socket.on('getAllActions', (updatedActions) => {
      setActions(updatedActions);
    });

    socket.on('getQueue', (updatedQueue) => {
      setQueue(updatedQueue);
    });

    socket.on('queueTimer', (time) => {
      setQueueTimer(time);
    });

    return () => {
      socket.off('getAllActions');
      socket.off('getQueue');
    };
  }, []);

  function handleActionClick(actionTypeId: string) {
    addActionToQueue(actionTypeId);
  }

  return (
    <>
      <h1>
        Vous êtes en <p>#VACANCES</p>
      </h1>
      <div className={styles.container}>
        <ActionList actions={actions} handleClick={handleActionClick} />
        <QueueList queue={queue} queueTimer={queueTimer} />
      </div>
    </>
  );
};
