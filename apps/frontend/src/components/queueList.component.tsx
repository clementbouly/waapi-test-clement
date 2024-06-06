import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { ActionType } from '../models/actions';
import { ListContainer } from './actionsList.component';

export const AnimatedLi = styled(motion.li)`
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
  margin: 5px 0;
  background-color: #f0f0f0;
  border-radius: 5px;
  transition: background-color 0.3s;
  list-style: none;

  &:hover {
    background-color: #e2e2e2;
  }
`;

type ActionListProps = {
  queue: ActionType[];
  queueTimer: number | null;
};

export const QueueList = ({ queue, queueTimer }: ActionListProps) => {
  return (
    <ListContainer>
      <h1>File d'attente - ({queueTimer})</h1>
      <ul>
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
      </ul>
    </ListContainer>
  );
};
