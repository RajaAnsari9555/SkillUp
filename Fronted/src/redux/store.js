
import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import courseSlice from "./courseSlice"
import lectureSlice from "./lectureSlice"
import reviewSlice from './reviewSlice'
import systemDesignSlice from './systemDesignSlice'
import noteSlice from './noteSlice'

 export const store = configureStore({
    reducer:{
        user:userSlice,
        course:courseSlice,
        lecture:lectureSlice,
        review:reviewSlice,
        systemDesign:systemDesignSlice,
        notes:noteSlice,
    }

 });

 export default store;