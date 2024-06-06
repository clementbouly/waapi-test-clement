import styled from 'styled-components';
import { StyledLi } from '../App';
import { ActionType } from '../models/actions';

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type ActionListProps = {
  actions: ActionType[];
  handleClick: (actionId: string) => void;
};

export const ActionList = ({ actions, handleClick }: ActionListProps) => {
  return (
    <ListContainer>
      <h1>Actions possibles</h1>
      <ul>
        {actions.map((action) => (
          <StyledLi key={action.id} onClick={() => handleClick(action.id)}>
            {action.name} - {action.currentCredits} crédits restants
          </StyledLi>
        ))}
      </ul>
    </ListContainer>
  );
};
