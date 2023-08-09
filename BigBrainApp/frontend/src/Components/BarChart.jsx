import React, { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

const BarChart = ({ resultData }) => {
  const chartRef = useRef(null);
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

  const [score, setScore] = React.useState([]);
  useEffect(() => {
    const scoreData = new Array(answerLength).fill(0);
    for (const player of resultData) {
      const answer = player.answers;
      for (let i = 0; i < player.answers.length; i++) {
        scoreData[i] += answer[i].correct;
      }
    }
    setScore(scoreData);
  }, [answerLength])

  useEffect(() => {
    if (chart.current !== null) {
      chart.current.destroy();
    }
    chart.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: questionCount,
        datasets: [
          {
            label: 'Correctness Percentage',
            data: score,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }
        ]
      },
      options: {
        scales: {
          y: {
            title: {
              display: true,
              text: 'Correct Percentage',
            },
            ticks: {
              beginAtZero: true,
              max: answerLength,
              callback: function (value) {
                return ((value / resultData.length) * 100).toFixed(0) + '%';
              }
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
  }, [score]);

  useEffect(() => {
    return () => {
      chart.current.destroy();
    }
  }, []);

  return (
    <canvas ref={chartRef} />
  );
};

export default BarChart;
