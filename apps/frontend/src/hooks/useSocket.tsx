import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ActionType } from '../models/actions';
import { addActionToQueue } from '../services/actions.service';

const socket = io('http://localhost:3000');

export const useSocket = () => {
  const [actions, setActions] = useState<ActionType[]>([]);
  const [queue, setQueue] = useState<ActionType[]>([]);
  const [queueTimer, setQueueTimer] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // get all actions and queue on mount
    socket.emit('getAllActions');
    socket.emit('getQueue');

    socket.on('getAllActions', (updatedActions: ActionType[]) => {
      setActions(updatedActions);
    });

    socket.on('getQueue', (updatedQueue: ActionType[]) => {
      setQueue(updatedQueue);
    });

    socket.on('queueTimer', (time: number) => {
      setQueueTimer(time);
    });

    socket.on('error', (errorMessage: string) => {
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

  return { actions, queue, queueTimer, error, handleActionClick };
};
