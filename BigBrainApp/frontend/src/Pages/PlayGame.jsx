import React from 'react';
import AnswerButton from '../Components/AnswerButton';
import { lightBlue } from '@mui/material/colors';
import { useNavigate, useParams } from 'react-router-dom';
import asyncAPI from '../APIGetAsync';
import ReactPlayer from 'react-player';
import makeRequest from '../API';

export default function PlayGamePage () {
  const params = useParams();
  const navigate = useNavigate();
  const [dataList, setdataList] = React.useState([]);
  const [solutionList, setSolutionList] = React.useState([]);
  const [youtube, setYoutube] = React.useState(null);
  const [timer, setTimer] = React.useState(0);
  const [currQuestion, setcurrQuestion] = React.useState(0);
  const [submitAnswer, setsubmitAnswer] = React.useState([]);

  React.useEffect(async () => {
    const interval = setInterval(async () => {
      const isActive = await asyncAPI(`/play/${params.playerID}/status`);
      if (isActive.started) {
        const dataQuestion = await asyncAPI(`/play/${params.playerID}/question`);
        if (dataQuestion.question.id !== currQuestion) {
          setcurrQuestion(dataQuestion.question.id);
        }
      } else {
        clearInterval(interval);
        navigate(`/Game/Player/${params.playerID}/Results`);
      }
    }, 1000)
    return () => clearInterval(interval);
  }, [])

  React.useEffect(async () => {
    const dataQuestion = await asyncAPI(`/play/${params.playerID}/question`);
    setdataList(dataQuestion.question);
    setsubmitAnswer([]);
    if (dataQuestion.question.url.includes('youtube')) {
      setYoutube(true);
    } else if (dataQuestion.question.url === '' || dataQuestion.question.url === undefined) {
      setYoutube(null);
    } else {
      setYoutube(false);
    }
    setTimer(Number(dataQuestion.question.time));
  }, [currQuestion])

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer => timer - 1);
      }
    }, 1000);
    if (timer === 0) {
      clearInterval(interval)
      makeRequest(`/play/${params.playerID}/answer`, 'GET', {})
        .then((solutionData) => {
          setSolutionList(solutionData);
        });
    }
    return async () => clearInterval(interval);
  }, [timer])

  function selectAnswer (answerName) {
    if (dataList.type === 'SingleChoice') {
      setsubmitAnswer([answerName]);
    } else if (dataList.type === 'MultipleChoice') {
      if (!submitAnswer.includes(answerName)) {
        setsubmitAnswer([...submitAnswer, answerName]);
      }
    }
  }

  React.useEffect(() => {
    if (submitAnswer.length !== 0) {
      makeRequest(`/play/${params.playerID}/answer`, 'PUT', {
        answerIds: submitAnswer
      });
    }
  }, [submitAnswer])

  function resetSelections () {
    setsubmitAnswer([]);
    makeRequest(`/play/${params.playerID}/answer`, 'PUT', {
      answerIds: submitAnswer
    });
  }

  return (
    <>
      <div style= {{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: 'Helvetica',
        backgroundColor: lightBlue[50],
      }}>
        <div style = {{
          paddingTop: '20px',
          paddingBottom: '40px',
          textAlign: 'center',
          backgroundColor: lightBlue[100],
        }}>
          <h1 style={{
            fontSize: '40px'
          }}>{dataList.title}
          </h1>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: '8%',
        }}>
          <div style= {{
            textAlign: 'center',
            marginRight: '10%',
            marginBottom: '2%',
          }}>
            <h2>{dataList.type}</h2>
          </div>
          <div style= {{
            textAlign: 'center',
            marginRight: '10%',
            marginBottom: '2%'
          }}>
            <h2>{timer}</h2>
          </div>
          <div style= {{
            textAlign: 'center',
            marginRight: '10%',
          }}>
            <h2>{dataList.points} Points</h2>
          </div>
        </div>
        {youtube &&
          <>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              marginLeft: '7%',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center'
              }}>
                <h2>Selections Made</h2>
                {submitAnswer.map((print, index) => (
                  <p key={index}>{print}</p>
                ))}
              </div>
              <div style ={{
                marginLeft: '10%',
                paddingTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '380px'
              }}>
                <ReactPlayer url={dataList.url} alt='A video to help the question'/>
              </div>
            </div>
          </>
        }
        {youtube === false &&
          <>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              marginLeft: '7%',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center'
              }}>
                <h2>Selections Made</h2>
                {submitAnswer.map((print, index) => (
                  <p key={index}>{print}</p>
                ))}
              </div>
              <div style ={{
                marginLeft: '10%',
                paddingTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '380px'
              }}>
                <img
                  src={dataList.url}
                  alt='An image to help the question'
                  style={{ width: '550px', height: '450px' }}
                />
              </div>
            </div>
          </>
        }
        {(youtube === null || youtube === undefined) &&
          <>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              marginLeft: '7%',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center'
              }}>
                <h2>Selections Made</h2>
                {submitAnswer.map((print, index) => (
                  <p key={index}>{print}</p>
                ))}
              </div>
              <div style ={{
                marginLeft: '10%',
                paddingTop: '20px',
                background: 'grey',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '380px'
              }}>
              </div>
            </div>
          </>
        }
        {/* Div Holding the button */}
        <div style={{
          width: '80%',
          paddingTop: '3%',
          alignItems: 'center',
          marginLeft: '10%',
        }}>

          {/* The buttons */}
          <div style={{
            paddingTop: '5%',
            paddingLeft: '2%',
            paddingRight: '2%',
            paddingBottom: '20%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}>
            {timer > 0 && dataList?.answer?.map(options => (
              <>
                <AnswerButton
                  key={options.id}
                  onClick={() => selectAnswer(options.name)}
                  answer={options.name}
                />
              </>
            ))}
            {timer > 0 && dataList.type === 'MultipleChoice' &&
              <AnswerButton
                onClick={() => resetSelections()}
                answer='Reset'
                color='error'
              />
            }
            {timer === 0 && solutionList?.answerIds?.map((solution, index) => (
              <AnswerButton
                key={index}
                answer={solution}
                color='success'
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
