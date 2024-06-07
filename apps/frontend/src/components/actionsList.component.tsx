import styled from 'styled-components';
import { ErrorMessage } from '../UI/Error';
import { ActionType } from '../models/actions';

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledLi = styled.li`
  font-size: 18px;
  padding: 1rem;
  cursor: pointer;
  margin: 0.5rem 0;
  background-color: #fbfeff;
  border-radius: 5px;
  transition: all 0.2s;
  list-style-type: none;
  box-shadow: 0px 0px 5px 0px #0000002e;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 0px 5px 0px #0000005e;
  }
`;

type ActionListProps = {
  actions: ActionType[];
  handleClick: (actionId: string) => void;
};

export const ActionList = ({ actions, handleClick }: ActionListProps) => {
  return (
    <ListContainer>
      <h2>Actions possibles</h2>
      <ul>
        {actions.length > 0 ? (
          actions.map((action) => (
            <StyledLi
              role="button"
              key={action.id}
              onClick={() => handleClick(action.id)}
            >
              <b>{action.name}</b> - <i>{action.currentCredits}</i> crédits
              restants
            </StyledLi>
          ))
        ) : (
          <ErrorMessage>Pas d'actions définies</ErrorMessage>
        )}
      </ul>
    </ListContainer>
  );
};
