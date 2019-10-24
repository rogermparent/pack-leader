import {styled} from 'linaria/react';

export const CalculatorForm = styled.div`
font-family: sans-serif;
font-size: 0.8em;
`;

export const ControlButton = styled.button`
display: block;
margin: 0.5em auto;
`;

export const PackageSettingsList = styled.ul`
list-style: none;
padding: 0;
margin: 0.5em 0;
width: 100%;
`;

export const PackageSettingListItem = styled.li`
display: flex;
align-items: center;
justify-content: center;
height: 1.5em;
border: 1px solid gray;
border-radius: 0.25em;
margin: 0.25em 0;
overflow: hidden;
>input:first-of-type{
  flex: 1;
}
>input[type=number]{
  width: 4em;
}
input, button {
  border-radius: 0;
  border: none;
  border-right: 1px solid gray;
  padding: 0 0.25em;
  vertical-align: middle;
  line-height: 0;
  height: 100%;
}
button {
  text-align: center;
  width: 1.75em;
  font-size: 0.8em;
  font-weight: bold;
  &:last-of-type{
    border: none;
  }
}
`;

export const TotalPartInput = styled.input`
width: 100%;
border: 1px solid gray;
border-radius: 0.25em;
padding: 0 0.5em;
`;

export const CalculatorResults = styled.ul`
list-style: none;
margin: 0.5em;
padding: 0.5em;
text-align: center;
display: flex;
flex-flow: row wrap;
li {
  >b {
    display: block;
  }
  margin: 0.25em;
  padding: 0.25em;
  min-width: 5em;
  border: 1px solid gray;
  border-radius: 0.25em;
}
`;

export const ErrorList = styled.ul`
list-style: none;
padding: 0;
margin: 0;
li {
  background-color: #E99;
  padding: 0.2em 0.5em;
}
`;
