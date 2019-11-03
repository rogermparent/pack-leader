import {styled} from 'linaria/react';

export const CalculatorForm = styled.form`
font-family: sans-serif;
font-size: 0.8em;
>input {
  padding-right: 0;
  width: 100%;
  overflow: hidden;
}
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
min-width: 330px;
flex-flow: row nowrap;
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
  width: 5em;
}
input, button {
  border-radius: 0;
  border-style: none solid none none;
  padding: 0 0.25em;
  vertical-align: middle;
  height: 100%;
}
input {
  padding: 0.15em;
}
button {
  text-align: center;
  height: 100%;
  width: 1.75em;
  font-size: 0.8em;
  font-weight: bold;
  &:last-of-type{
    border: none;
  }
}
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
