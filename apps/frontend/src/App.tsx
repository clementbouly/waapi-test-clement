import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import styles from './App.module.css';
import { ErrorMessage } from './UI/Error';
import { ActionList } from './components/actionsList.component';
import { QueueList } from './components/queueList.component';
import { ActionType } from './models/actions';
import { addActionToQueue } from './services/actions.service';

const socket = io('http://localhost:3000');

const HighlightedText = styled.span`
  color: #45b2e8;
`;

export const App = () => {
  const [actions, setActions] = useState<ActionType[]>([]);
  const [queue, setQueue] = useState<ActionType[]>([]);
  const [queueTimer, setQueueTimer] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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

    socket.on('error', (errorMessage) => {
      setError(errorMessage);
    });

    return () => {
      socket.off('getAllActions');
      socket.off('getQueue');
      socket.off('queueTimer');
      socket.off('error');
    };
  }, []);

  const handleActionClick = async (actionTypeId: string) => {
    try {
      await addActionToQueue(actionTypeId);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <>
      <h1>
        Vous êtes en <HighlightedText>#VACANCES</HighlightedText>
      </h1>
      {error ? (
        <ErrorMessage>Error: {error}</ErrorMessage>
      ) : (
        <div className={styles.container}>
          <ActionList actions={actions} handleClick={handleActionClick} />
          <QueueList queue={queue} queueTimer={queueTimer} />
        </div>
      )}
    </>
  );
};
