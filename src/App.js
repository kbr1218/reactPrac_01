// 함수를 호출하여 값을 기억할 수 있는 함수 import
import { useEffect, useState } from "react";
import JSConfetti from 'js-confetti';

// 재사용 가능한 component 만들기
// Board에서 전달한 value 속성을 읽도록 만들기
// function Square({value}): Square component가 value라는 속성(props)를 받을 수 있음을 나타냄
function Square({ value, onSquareClick }) {
  // value: 값을 저장하는 변수
  // setValue: 값을 변경하는데 사용할 수 있는 함수
  // const [value, setValue] = useState(null);

  // 클릭 시 X로 채우는 handleClick 함수 선언
  // function handleClick() {
  //   setValue('X');
  //   console.log('clicked!야호');
  // }

  // 이미지 파일
  const xImg = './imgs/X_04.png';
  const oImg = './imgs/O_04.png';

  return <button className="square"
    onClick={onSquareClick}
  >
    {value === 'X' && <img src={xImg} alt='X' style={{width: '100%', height: '100%'}} />}
    {value === 'O' && <img src={oImg} alt='O' style={{width: '100%', height: '100%'}} />}
  </button>
}

// export: 파일 외부에서 이 함수로 접근 가능하게 하도록 만듦
function Board( {xIsNext, squares, onPlay}) {
  // O >> X로 변경하기
  // 각 플레이어가 움직일 때마다 xIsNext(boolean)값이 변경되어 다음 플레이어가 결정되고 게임 상태가 저장됨
  // const [xIsNext, setXIsNext] = useState(true);
  // 게임의 상태를 저장할 변수 만들기 (9개의 null 배열)
  // const [squares, setSquares] = useState(Array(9).fill(null));

  // squares 배열의 복사본인 nextSquares 생성
  function handleClick(i) {
    // 클릭한 배열에 이미 값이 있다면 함수 종료
    // || 플레이어가 이겼는지 확인
    if (squares[i] || calculateWinner(squares)) {
      if (calculateWinner(squares)) console.log('calculateWinner 함수 호출');
      if (squares[i]) console.log('해당 칸은 이미 선택되었습니다.');
      return;
    }

    // slice(): 배열로부터 특정 범위를 복사한 값들을 담고 있는 새로운 배열을 만드는 데 사용
    // 굳이 nextSquares 변수를 만들어서 복사한 값을 저장하는 이유 (*불변성*)
    // : 이전 동작으로 돌아가는 타임 트래블 기능을 구현하기 위해
    // : 부모 컴포넌트의 상태가 변경되면 기본적으로 하위 컴포넌트가 자동적으로 다시 렌더링됨
    // : 컴포넌트가 데이터가 변경되었는지 여부를 비교하는 것이 매우 저렴하게 만듦
    const nextSquares = squares.slice();

    // O >> X 변경 if문
    if (xIsNext) {
      nextSquares[i] = "X";
      console.log('X is clicked!');
    } else {
      nextSquares[i] = "O";
      console.log('O is clicked!');
    }
    // nextSquares[i] = "X";
    // setSquares(nextSquares);
    // setXIsNext(!xIsNext);

    // setSquares와 setXIsNext를 삭제하고
    // 사용자가 square를 클릭할 때 업데이트된 squares 배열을 전달하기 위한 함수(onPlay) 호출
    onPlay(nextSquares);
  }

  // 게임 상태를 알려주기 위한 텍스트 출력
  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = "Winner is: " + winner;
  } else {
    status = "Next Player is : " + (xIsNext? "X":"O");
  }

  // Square 컴포넌트를 반복문으로 생성
  const renderSquares = (i) => (
    <Square
      key = {i}
      value={squares[i]}
      onSquareClick={() => handleClick(i)}
    />
  )

  return (
    // React component는 하나의 JSX 요소를 반환하므로 프래그먼트(<>)로 감싸야 함
    <>
      <div className='container'>
      <h3 className="status">{status}</h3>
      {/* <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div> */}
      <div className="table">
        {Array.from({length: 3}).map((_, rowIndex) => (
          <div key={rowIndex} className='board-row'>
            {Array.from({length:3}).map((_, colIndex) => renderSquares(rowIndex * 3 + colIndex))}
          </div>
        ))}
      </div>

      </div>
    </>
  );
}

// Board 컴포넌트에서 squares 상태를 제거하고 export defualt 지우기
// Game을 만들어서 Board를 올림
// Game 함수 앞에 **export default**를 추가해서 Game을 최상위 컴포넌트로 사용
export default function Game() {
  // 다음 게임 플레이어와 동작 기록을 추적하기 위한 상태 추가
  // const[xIsNext, setXIsNext] = useState(true);
  // currentMove가 짝수라면 xIsNext === true,
  // currentMove가 홀수라면 xIsNext === false
  // >> 따라서 xIsNext 상태변수를 사용하지 않고 currentMove만 사용할 수 있음

  const[history, setHistory] = useState([Array(9).fill(null)])  // null로 이루어진 9개 배열
  // 사용자가 보고 있는 단계를 저장하는 상태변수 추가 (기본값 0)
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;

  // 현재 선택된 이동을 렌더링하도록 변경
  const currentSquares = history[currentMove]

  // Confetti 효과 추가
  const jsConfetti = new JSConfetti();

  useEffect(() =>  {
    const winner = calculateWinner(currentSquares);
    if (winner) {
      jsConfetti.addConfetti({
        // confettiColors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7'],
        // confettiRadius: 4,
        // confettiNumber: 500,
        emojis: ['💚', '🍏', '📗'],
        emojiSize:60,
        confettiNumber:30,
      });
    }
  }, [currentSquares]);

  function handlePlay(nextSquares){
    // 이전 move로 돌아간 후 새로운 수를 만들면 그 지점까지만 유지하도록 함
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    // history의 배열 뒤에 nextSquares를 추가한 새로운 배열 생성
    // ...history: history의 모든 항목을 열거한다라는 말
    // setHistory( [...history, nextSquares] );
    // setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
    // currentMove를 변경할 숫자가 짝수라면 xIsNext를 true로 설정
    // setXIsNext(nextMove % 2 === 0);  // setXIsNext 상태변수 사용X
    console.log('jumpTo 함수 호출')
  }

  function pageReload() {
    window.location.reload();
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0){
      description = 'Jump to #' + move;
    } else {
      description = 'RESET'
    }

    return (
      <div class='frame'>
      {/* // 각 움직임에 대해 <li> 요소에 <button> 생성 */}
      {/* // 버튼은 onClick 핸들러를 가지고 있고, jumpTo 함수 호출 */}
        <ul key={move}>
          <button class='custom-btn btn-11' onClick={() => jumpTo(move)}>{description}
          </button>
          </ul>
      </div>
    );
  });

  return (
    <>
    <button className='titleButton' onClick={() => pageReload()}>
      <img src="./imgs/title2.png" className="titleImg"/>
    </button>
    <div className="game">
      <div className="game-board">
        {/* xIsNext, currentSquares, handlePlay를 props로 Board에 전달 */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
    </>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // row1
    [3, 4, 5], // row2
    [6, 7, 8], // row3
    [0, 3, 6], // col1
    [1, 4, 7], // col2
    [2, 5, 8], // col3
    [0, 4, 8], // dia L>R
    [2, 4, 6]  // dia R>L
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // 1. squares[a]: null 또는 undefined라면 비어있는 칸 의미 >> 승자 판별 불가 >> false
    // 2. squares[a] === squares[b]: a와 b가 같은 기호를 가지고 있는지 확인
    // 3. squares[a] === squares[c]: a와 c가 같은 기호를 가지고 있는지 확인
    // >> a, b, c가 같은 기호를 가지고 있는지 확인하는 조건
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // 승리한 플레이어의 기호 (O 또는 X) 반환
      return squares[a];
    }
  }
  // 승자가 없으면 null 반환
  return null;
}