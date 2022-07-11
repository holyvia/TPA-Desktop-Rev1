import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import Navbar from './pages/Navbar';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import './output.css'
import { AuthContextProvider } from './pages/AuthContext';
import Home from './pages/Home';
import EditProfile from './pages/EditProfile';
import BoardGallery from './pages/BoardGallery';
import WorkspaceMember from './pages/WorkspaceMember';
import InviteToWorkspace from './pages/InviteToWorkspace';
import InvitedView from './pages/InvitedView';
import SignInToInvite from './pages/SignInToInvite';
import ListGallery from './pages/ListGallery';
import InviteToBoard from './pages/InviteToBoard';
import BoardMember from './pages/BoardMember';
import SeeNotification from './pages/SeeNotification';
import ClosedBoard from './pages/ClosedBoard';
import FavoriteBoard from './pages/FavoriteBoard';
import MyCalendar from './pages/Calendar';
// import { Calendar } from 'react-big-calendar';
export const currUserContext = React.createContext()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<currUserContext.Provider>
  <AuthContextProvider>
    <React.StrictMode>
      <Router>
          <Routes>
            <Route exact path = "/editProfile" element={<EditProfile/>}/>
            <Route exact path = "/signIn/:docID" element={<SignInToInvite/>}/>
            <Route exact path = "/signIn" element={<SignIn/>}/>
            <Route exact path = "/invitedView/:docID" element={<InvitedView/>}/>
            <Route exact path = "/home/:userID" element={<Home/>}/>
            <Route exact path = "/closed" element={<ClosedBoard/>}/>
            <Route exact path = "/favorite" element={<FavoriteBoard/>}/>
            <Route exact path = "/inviteToBoard/:workspaceID/:boardID" element={<InviteToBoard/>}/>
            <Route exact path = "/inviteToWorkspace/:workspaceID" element={<InviteToWorkspace/>}/>
            <Route exact path = "/boardGallery/:workspaceID" element={<BoardGallery/>}/>
            <Route exact path = "/calendar/:workspaceID/:boardID" element={<MyCalendar/>}/>
            <Route exact path = "/cardGallery/:workspaceID/:boardID/:listID/:cardID" element={<ListGallery/>}/>
            <Route exact path = "/cardGallery/:workspaceID/:boardID" element={<ListGallery/>}/>
            <Route exact path = "/seeWorkspaceMember/:workspaceID" element={<WorkspaceMember/>}/>
            <Route exact path = "/seeBoardMember/:workspaceID/:boardID" element={<BoardMember/>}/>
            <Route exact path = "/notif" element={<SeeNotification/>}/>
            <Route exact path = "/" element={<SignUp/>}/>
          </Routes>
        </Router>
    </React.StrictMode>
  </AuthContextProvider>
  // <Kanban></Kanban>
  // <ViewMember/>
  // <BoardGallery/>
  // <SignUp/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
