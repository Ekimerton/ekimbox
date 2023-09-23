import { Avatar } from "antd";
import { generateAnonymousName } from "./utils";

import snowman from "./profile_pics/snowman.png";
import creeper from "./profile_pics/creeper.png";
import kirby from "./profile_pics/kirby.png";
import mario from "./profile_pics/mario.png";
import minion from "./profile_pics/minion.png";
import clown from "./profile_pics/clown.png";

const images = [snowman, creeper, kirby, mario, minion, clown];

const PlayerProfile = ({ name = "Anonymous", picNum = 0, userHidden }) => {
  return (
    <>
      <Avatar
        size={50}
        shape="circle"
        src={
          userHidden ? null : (
            <img
              src={images[picNum]}
              alt={name}
              style={{ objectFit: "cover" }}
            />
          )
        }
      />
      <p style={{ marginLeft: 16, marginRight: 8 }}>
        {userHidden ? generateAnonymousName() : name}
      </p>
    </>
  );
};

export default PlayerProfile;
