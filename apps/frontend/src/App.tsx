import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import { ActionType } from './models/actions';

const socket = io('http://localhost:3000');

const StyledLi = styled.li`
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
  margin: 5px 0;
  background-color: #f0f0f0;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e2e2e2;
  }
`;

export const App = () => {
  const [actions, setActions] = useState<ActionType[]>([]);
  const [queue, setQueue] = useState<ActionType[]>([]);

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
    <>
      <h1>Actions possibles !</h1>
      <ul>
        {actions.map((action) => (
          <StyledLi
            key={action.id}
            onClick={() => handleActionClick(action.id)}
          >
            {action.name} - {action.currentCredits} crédits restants
          </StyledLi>
        ))}
      </ul>

      <h1>File d'attente</h1>
      <ul>
        {queue.map((action) => (
          <StyledLi key={action.id + Math.random()}>{action.name}</StyledLi>
        ))}
      </ul>
    </>
  );
};
