import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { ActionType } from '../models/actions';
import { ListContainer } from './actionsList.component';

export const AnimatedLi = styled(motion.li)`
  font-size: 18px;
  padding: 1rem;
  cursor: pointer;
  margin: 0.5rem 0;
  background-color: #fbfeff;
  border-radius: 5px;
  transition: background-color 0.3s;
  list-style: none;
  font-weight: bold;
  box-shadow: 0px 0px 5px 0px #0000002e;

  &:hover {
    background-color: #fbfeffb5;
  }
`;

const StyledUl = styled.ul`
  width: 20rem;
`;

type ActionListProps = {
  queue: ActionType[];
  queueTimer: number | null;
};

export const QueueList = ({ queue, queueTimer }: ActionListProps) => {
  return (
    <ListContainer>
      <h2>
        File d'attente -{' '}
        <span role="img" aria-label="time">
          ⏳
        </span>
        {queueTimer ? `${queueTimer}s` : 'Calculating...'}
      </h2>
      <StyledUl>
        <AnimatePresence>
          {queue.map((action) => (
            <AnimatedLi
              key={action.userActionId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              {action.name}
            </AnimatedLi>
          ))}
        </AnimatePresence>
      </StyledUl>
    </ListContainer>
  );
};
