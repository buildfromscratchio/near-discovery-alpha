import { useSnackbar } from "notistack";
import React, {
  useState,
  createContext,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const CollaborationContext = createContext();

export const CollaborationContextProvider = (props) => {
  const { currentChannel } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { isAuthenticated, user } = useContext(AuthContext);

  const [socket, setSocket] = useState(null);
  const [code, setCode] = useState("return (<div><h1>hello world</h1></div>)");

  const [memberList, setMemberList] = useState([]);

  let memberListRow = [];

  const updateMemberList = useCallback(
    (newMembers) => {
      const uniqueMembers = newMembers.filter(
        (member, index, array) =>
          array.findIndex((m) => m.name === member.name) === index
      );
      setMemberList(uniqueMembers);
    },
    [memberList]
  );

  useEffect(() => {
    // Connect to Socket.IO server
    console.log(`SOCKET_URL`, process.env.SOCKET_URL);
    const newSocket = io(process.env.SOCKET_URL);
    // const newSocket = io(
    //   "https://cjn8k6noib.execute-api.us-east-1.amazonaws.com/"
    // );

    console.log(`SOCKET_URL`, newSocket);
    setSocket(newSocket);

    return () => {
      // Disconnect from Socket.IO server on component unmount
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && isAuthenticated) {
      console.log("user?.name || user?.userName || user?.email, : ", user);
      // Join channel with user object
      socket.emit("joinChannel", currentChannel, {
        name: user?.name || user?.userName || user?.email,
        avatar: user?.avatar,
      });
      // ||
      // [...Array(15)]
      //   .map(() => Math.random().toString(36)[2])
      //   .join("")
      //   .toUpperCase(),

      // Event listener for receiving new messages from server
      socket.on("code", (user, code) => {
        setCode(code);
      });

      // Event listener for receiving member list updates from server
      socket.on("memberList", (newMembers) => {
        // Update the memberList state
        // console.log("New Members", newMembers);
        // console.log("Old Members", memberListRow);

        if (memberListRow?.length > 0) {
          // Find added members
          const addedMembers = newMembers.filter(
            (newMember) =>
              !memberListRow.some((member) => member.name === newMember.name)
          );

          // Find removed members
          const removedMembers = memberListRow.filter(
            (member) =>
              !newMembers.some((newMember) => newMember.name === member.name)
          );

          // Log details of added members
          addedMembers.forEach((newMember) => {
            console.log(
              `New member added: ${newMember.name}, ID: ${newMember.name}`
            );
            enqueueSnackbar(`${newMember.name} has connected.`, {
              variant: "success",
            });
          });

          // Log details of removed members
          removedMembers.forEach((member) => {
            console.log(`Member removed: ${member.name}, ID: ${member.name}`);
            enqueueSnackbar(`${member.name} has disconnected.`, {
              variant: "warning",
            });
          });
        }

        memberListRow = newMembers;

        updateMemberList(newMembers);
      });
    }
  }, [socket, currentChannel]);

  const debouncedFunction = useDebouncedCallback(() => {
    socket.emit("code", currentChannel, code);
  }, 500);

  const onChange = (code) => {
    console.log(code);
    setCode(code);
    debouncedFunction();
  };

  return (
    <CollaborationContext.Provider
      value={{
        socket,
        memberList,
        code,
        onChange,
      }}
    >
      {props.children}
    </CollaborationContext.Provider>
  );
};

export default CollaborationContextProvider;
