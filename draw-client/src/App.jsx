/* eslint-disable react/prop-types */
import styled from 'styled-components';
import GlobalStyles from './GlobalStyles';
import { QRCode } from 'antd';


function App() {

  const Wrapper = styled.div`
    height: 100vh;
    width: 100vw;
    max-height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    padding: 4vh;

    background: repeating-linear-gradient(
      45deg,
      #606dbc,
      #606dbc 5%,
      #465298 5%,
      #465298 10%
    );
    background-size: 75vh 75vh;
    animation: move-it 15s linear infinite;

  @keyframes move-it {
    0% {
      background-position: initial;
    }
    100% {
      background-position: 75vh 0;
    }
}
  `

  const WebPage = styled.div`
    background-color: #333333;
    color: white;
    flex: 3;
    border-radius: 1vh;
    padding: 1.25vh;
  `

  const TrafficLightWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.9vh;
  `

  const TrafficLight = styled.div`
    width: 1.4vh;
    height: 1.4vh;
    border-radius: 100%;
    background-color: ${(props) => props.color || "white"};
  `

  const JoinCodeWrapper = styled.div`
    flex: 4;
    width: 60vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4vh;
  `

  const JoinCodeText = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;

    h1 {
      font-size: 10vh;
      line-height: 9vh;
      font-weight: 300;
      margin: 0;
    }

    p {
      font-size: 3vh;
    }
  `

  const Logo = styled.h1`
    margin: 1vh 1vh;
    font-size: 3vh;
  `

  const SectionHeader = styled.h2`
    font-size: 3.5vh;
    font-weight: 300;
    text-align: center;
    margin-top: 1.5vh;
    margin-bottom: 2vh;
  `

  const HeroSection = styled.section`
    background-color: #111111;
    margin: 0 -1.25vh;
    padding: 4vh 8vh;

    h1 {
      font-size: 5vh;
    }
  `

  const QRCodeWrapper = styled.div`
    background-color: white;
    border-radius: 1vh;
  `

  const PlayerWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4vh;
    padding: 0vh 0vh;
    justify-content: center;
  `
  
  const PlayerLogo = styled.img`
    width: ${(props) => props.small ? "8vh" : "24vh"};
    height: 8vh;
    object-fit: cover;
  `

  return (
    <>
    <Wrapper>
      <JoinCodeWrapper>
        <QRCodeWrapper bordered={false}>
          <QRCode size={250} value="google.com"/>
        </QRCodeWrapper>
        <JoinCodeText>
          <p>Join on chickadee.fun</p>
          <h1>SDAD</h1>
        </JoinCodeText>

      </JoinCodeWrapper>
      <WebPage>
        <TrafficLightWrapper>
          <TrafficLight color="#FF7878"/>
          <TrafficLight color="#FFC700"/>
          <TrafficLight color="#97E274"/>
        </TrafficLightWrapper>
        <Logo>Webpage</Logo>
        <HeroSection>
          <h1>We&apos;re changing the way the world invests.</h1>
        </HeroSection>
        <SectionHeader>Proudly affiliated with <strong>(0/8)</strong> companies</SectionHeader>
        <PlayerWrapper>
          <PlayerLogo src="/small_logo.png" small/>
          <PlayerLogo src="/big_logo.png"/>
          <PlayerLogo src="/big_logo.png"/>
          <PlayerLogo src="/big_logo.png"/>
          <PlayerLogo src="/big_logo.png"/>
          <PlayerLogo src="/big_logo.png"/>
          <PlayerLogo src="/big_logo.png"/>
          <PlayerLogo src="/big_logo.png"/>
        </PlayerWrapper>
      </WebPage>
    </Wrapper>
    <GlobalStyles />
    </>
  )
}

export default App
