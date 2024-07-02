import styled from 'styled-components';
import styles from './App.module.css';
import { ErrorMessage } from './UI/Error';
import { ActionList } from './components/actionsList.component';
import { QueueList } from './components/queueList.component';
import { useSocket } from './hooks/useSocket';

const HighlightedText = styled.span`
  color: #45b2e8;
`;

export const App = () => {
  const { actions, queue, queueTimer, error, handleActionClick } = useSocket();

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
