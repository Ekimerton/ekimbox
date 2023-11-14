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
    padding: 2.5vw;

    background: repeating-linear-gradient(
      45deg,
      #606dbc,
      #606dbc 5%,
      #465298 5%,
      #465298 10%
    );
    background-size: 75vw 75vw;
    animation: move-it 20s linear infinite;

  @keyframes move-it {
    0% {
      background-position: initial;
    }
    100% {
      background-position: 75vw 0;
    }
}
  `

  const WebPage = styled.div`
    background-color: #333333;
    color: white;
    flex: 3;
    width: 30vw;
    border-radius: 1vw;
    padding: 1vw;
  `

  const TrafficLightWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.7vw;
  `

  const TrafficLight = styled.div`
    width: 0.8vw;
    height: 0.8vw;
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
    gap: 2vw;
  `

  const JoinCodeText = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;

    h1 {
      font-size: 6vw;
      line-height: 6vw;
      font-weight: 300;
      margin: 0;
    }

    p {
      font-size: 1.5vw;
    }
  `

  const Logo = styled.h1`
    margin: 0.6vw 0.6vw;
    font-size: 1.7vw;
  `

  const SectionHeader = styled.h2`
    font-size: 2vw;
    font-weight: 300;
    text-align: center;
    margin-top: 0.8vw;
    margin-bottom: 1.6vw;
  `

  const HeroSection = styled.section`
    background-color: #111111;
    margin: 0 -1vw;
    padding: 2vw 3vw;

    h1 {
      font-size: 3vw;
    }
  `

  const QRCodeWrapper = styled.div`
    background-color: white;
    border-radius: 0.7vw;
  `

  const PlayerWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 2vw;
    justify-content: center;
  `
  
  const PlayerLogo = styled.img`
    width: ${(props) => props.small ? "4.5vw" : "13.5vw"};
    height: 4.5vw;
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
