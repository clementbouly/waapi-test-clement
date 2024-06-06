import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import styles from './App.module.css';
import { ActionList } from './components/actionsList.component';
import { QueueList } from './components/queueList.component';
import { ActionType } from './models/actions';

const socket = io('http://localhost:3000');

export const StyledLi = styled.li`
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
  margin: 5px 0;
  background-color: #f0f0f0;
  border-radius: 5px;
  transition: background-color 0.3s;
  list-style-type: none;

  &:hover {
    background-color: #e2e2e2;
  }
`;

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
    fetch('http://localhost:3000/api/actions/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ actionTypeId: actionTypeId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Action added to queue:', data);
        // Potentially emit an event here if needed
      })
      .catch((error) => console.error('Error adding action to queue:', error));
  }

  return (
    <div className={styles.container}>
      <ActionList actions={actions} handleClick={handleActionClick} />
      <QueueList queue={queue} queueTimer={queueTimer} />
    </div>
  );
};
