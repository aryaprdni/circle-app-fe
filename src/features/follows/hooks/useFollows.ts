import { useDispatch, useSelector } from "react-redux";
import { API, setAuthToken } from "../../../libs/axios";
import { GET_FOLLOWS, SET_FOLLOW } from "../../../store/RootReducer";
import { useEffect } from "react";
import { RootState } from "../../../store/types/RootState";

export default function useFollows() {
  setAuthToken(localStorage.token);
  const users = useSelector((state: RootState) => state.users);
  const followState = useSelector((state: RootState) => state.follow.followState);
  const follows = useSelector((state: RootState) => state.follow.follows);
  const dispatch = useDispatch();

  // PAGE FOLLOW
  async function getFollowData() {
    const response = await API.get(`/follow?type=${followState}`);
    console.log("Follows data from API:", response.data);
    dispatch(GET_FOLLOWS(response.data));
  }

  async function handleFollow(id: number, followingUserId: number, is_following: boolean) {
    try {
      dispatch(SET_FOLLOW({ id: id, is_following: !is_following }));
      if (!is_following) {
        await API.post(`/follow`, {
          followingUserId: followingUserId,
        });
        await getFollowData();
        // console.log("berhasil follow!", response.data);
      } else {
        await API.delete(`/follow/${followingUserId}`);
        // console.log("berhasil unfollow!", response.data);
        await getFollowData();
      }
    } catch (error) {
      console.error("error", error);
      dispatch(SET_FOLLOW({ id: id, is_following: is_following }));
      throw error;
    }
  }

  useEffect(() => {
    getFollowData();
    // getSuggestedFollowing();
  }, [followState]);

  return {
    users,
    follows,
    followState,
    handleFollow,
  };
}
