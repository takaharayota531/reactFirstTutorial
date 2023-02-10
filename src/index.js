import React from "react";
import ReactDOM  from "react-dom/client";
import  './index.css';


// class Square extends React.Component{

//     // constructor(props){
//     //     super(props);
//     //     this.state={
//     //         numValue:null,
//     //     };
//     // }


//     render(){
//         return(
//             <button className="square" onClick={()=>this.props.onClick()} >
//                 {this.props.numValue}
//             </button>
//         );
//     }
// }

function Square(props){
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}


class Board extends React.Component{
    renderSquare(i){
        return <Square value={this.props.squares[i]}
        onClick={()=> this.props.onClick(i)}
        />;
    }

    render(){
        

        return(
            <div>
                {/* <div className="status">{status}</div> */}
                <div  className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div  className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div  className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component{

    constructor(props){
        super(props);
        this.state={
            history:[{squares:Array(9).fill(null),}],
            stepNumber:0,
            xIsNext:true,

        }
    }
    handleClick(i){
        // immutable like 
        // 複雑な機能が簡単に実装できる
        // 変更の検出が容易にできる
        // pure componentを構築しやすい

        const history=this.state.history.slice(0,this.state.stepNumber+1);
        const current=history[history.length-1];
        const squares=current.squares.slice();

        if(calculateWinner(squares)|| squares[i]){
            // 勝者が確定した場合またはその盤面がすでに選択された場合は関数を抜ける
            return;
        }

        squares[i]=this.state.xIsNext?'X':'O';
        this.setState({
            history:history.concat([{
                squares:squares,    
            }]),
            stepNumber:history.length,
            xIsNext:!this.state.xIsNext,

        });
    }
    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext:(step%2)===0,
            
        })
    }

    render(){
        const history=this.state.history;
        const current=history[this.state.stepNumber];
        const winner=calculateWinner(current.squares);

        const moves=history.map((step,move)=>{
            const desc=move?
            'Go to move #'+move:
            'Go to game start';
            return (
                // 再レンダリングされるcomponentには一意となるkeyを割り当てておく
                <li key={move}>
                    <button onClick={()=>this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });


        let status;
        //勝者が確定した場合は勝者表示する
        if(winner){
            status='winner:'+winner;
        }
        else{
            status='Next player is '+(this.state.xIsNext?'X':'O');
        }
    

        return(
            <div className="game">
                <div className="game-board">
                    <Board 
                    squares={current.squares}
                    onClick={(i)=>this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

//calculate winner function
function calculateWinner(squares){
    const lines=[
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for(let i=0;i<lines.length;i++){
        const [a,b,c]=lines[i];
        if(squares[a]&& squares[a]==squares[b]&& squares[a]==squares[c]){
            return squares[a];
        }

    }
    return null;
}

// 

const root  =ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);