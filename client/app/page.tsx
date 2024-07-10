import FollowingMembers from "./components/FollowingMembers";
import Posts from "./components/Posts";
import ProtectedRoute from "./components/ProtectedRoute";
//import ClientComponent from "./components/login";


export default function Home() {

  return (
    // <ProtectedRoute>
      <div>
        <div className='flex'>
          <div className='sticky md:block hidden'>
          <FollowingMembers/>
          </div>
          
          <Posts/>
        </div>
      </div>
      // </ProtectedRoute>
    
  );
}

