import { useState } from "react";
import { Card, Button, Space } from "antd";

function VoteView({ questionPrompt, answers, socket, clientId }) {
  const [vote, setVote] = useState(-1);

  const handleVote = (answerOption, index) => {
    setVote(index);
    socket.current.emit("vote", {
      clientId: clientId,
      questionPrompt: questionPrompt,
      votedForID: answerOption.player.id,
    });
  };

  return (
    <Card title={`Vote Prompt`} style={{ width: "100%" }} size="small">
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <h4 style={{ textAlign: "center" }}>{questionPrompt}</h4>
        {answers.map((answerOption, index) => (
          <Button
            block
            size="large"
            style={{
              whiteSpace: "normal",
              height: "auto",
            }}
            type={vote === index ? "primary" : "default"}
            onClick={() => handleVote(answerOption, index)}
          >
            {answerOption.answer}
          </Button>
        ))}
      </Space>
    </Card>
  );
}

export default VoteView;
