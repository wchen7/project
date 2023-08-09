import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ resultData }) => {
  const chartContainer = useRef(null);
  const chart = useRef(null);
  const [questionCount, setQuestionCount] = React.useState([]);
  const [answerLength, setAnswerLength] = React.useState(0);

  useEffect(() => {
    if (resultData.length !== 0) {
      const indexes = resultData?.map((object) => object.answers.map((answers, index) => index));
      const flattenedArray = [].concat(...indexes);
      const uniqueQuestions = [...new Set(flattenedArray)];
      setQuestionCount([...uniqueQuestions]);
      setAnswerLength(flattenedArray.length / resultData.length);
    }
  }, [])

  const [time, setTime] = React.useState([]);
  useEffect(() => {
    const responseTimes = new Array(answerLength).fill(0);
    resultData?.forEach((player) => {
      const answers = player.answers;
      for (let i = 0; i < answers.length; i++) {
        const answeredSeconds = new Date(answers[i].answeredAt).getTime() / 1000;
        const questionStartedSeconds = new Date(answers[i].questionStartedAt).getTime() / 1000;
        const diff = Math.abs(answeredSeconds - questionStartedSeconds);
        responseTimes[i] += diff / answerLength;
      }
    });
    setTime(responseTimes);
  }, [answerLength]);

  useEffect(() => {
    if (chart.current) {
      chart.current.destroy();
    }

    const ctx = chartContainer.current.getContext('2d');
    chart.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: questionCount,
        datasets: [{
          label: 'Quickness to Questions',
          data: time,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Average response times in seconds',
            },
            ticks: {
              callback: (value) => `${value}s`,
              stepSize: 10
            }
          },
          x: {
            title: {
              display: true,
              text: 'Position of Questions',
            },
          }
        }
      }
    });

    return () => {
      chart.current.destroy();
    };
  }, [time]);

  return (
    <div>
      <canvas ref={chartContainer}></canvas>
    </div>
  );
}

export default LineChart;
