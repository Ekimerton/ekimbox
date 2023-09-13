import { useState } from "react";
import { Card, Input, Button, Space } from "antd";

function AnswerView({ prompts, socket, clientId }) {
  const [answer, setAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSubmitAnswer = () => {
    if (answer) {
      socket.current.emit("answer", {
        clientId: clientId,
        prompt: prompts[currentIndex],
        answer: answer,
      });
      setAnswer("");
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (currentIndex >= prompts.length) {
    return (
      <Card title={`Jokes Complete 🎉`} style={{ width: "100%" }} size="small">
        <p style={{ margin: 0 }}>
          All done for now! Kick back and enjoy some rest. Get ready to vote for
          your own answers :^)
        </p>
      </Card>
    );
  }

  return (
    <Card
      title={`Joke Prompt`}
      extra={`${currentIndex + 1}/${prompts.length}`}
      style={{ width: "100%" }}
      size="small"
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <h4>{prompts[currentIndex]}</h4>
        <Input.TextArea
          type="text"
          size="large"
          maxLength={120}
          allowClear
          style={{ resize: "none" }}
          rows={3}
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
          }}
        />
        <Button
          block
          size="large"
          type="primary"
          disabled={answer.length === 0}
          onClick={() => handleSubmitAnswer()}
        >
          Submit Answer
        </Button>
      </Space>
    </Card>
  );
}

export default AnswerView;
