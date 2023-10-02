import { combineReducers } from 'redux';
import user from './user_reducer';

// 여러 개의 Reducer를 하나의 store에서 실행할 수 있도록 combineReducers를 사용
const rootReducer = combineReducers({
  user
})

export default rootReducer;