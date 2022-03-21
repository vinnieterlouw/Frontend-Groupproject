import { BLOG_CREATION_SUCCESS ,VIEW_BLOG_DETAIL} from "./actions";
const initialState = {
    blogs:[],
    blogDetail:[]
}
export default function reducer(state = initialState, action) {
    console.log("payload",action.payload);
    switch(action.type){
       
    case BLOG_CREATION_SUCCESS:
        return {...state,blogs:{...action.payload}};
      
    case VIEW_BLOG_DETAIL:
        return {...state,blogDetail:{...action.payload}};
        default:
            return state;
    }
}