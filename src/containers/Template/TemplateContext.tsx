import { createCtx } from './create-context';

const initialState = {
  _id:null,
  name:null,
  formSchema:null,
  category_id:null,
  uiSchema:null
};
type State = typeof initialState;
type Action = any;
function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'TEMPLATE_DETAILS':
      const {payload}=action
        return{
          ...state,
          _id:payload[1],
          name:payload[2],
          category_id:payload[3],
          formSchema:payload[4],
          uiSchema:payload[5]
        }
    default:
        return state;
  }
}


const [useTemplateState, useTemplateDispatch, TemplateProvider] = createCtx(
  initialState,
  reducer
);

export { useTemplateState, useTemplateDispatch, TemplateProvider };
