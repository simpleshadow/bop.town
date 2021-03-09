const IndexPage = () => (
  <div className="flex items-center justify-center h-screen w-screen bg-black text-white" style={makeCursor('white')}>
    <h1>(•◡•)</h1>
  </div>
)

const makeCursor = (color: string) => {
  var cursor = document.createElement('canvas'),
        ctx = cursor.getContext('2d');

    cursor.width = 16;
    cursor.height = 16;

    ctx.strokeStyle = color;

    ctx.lineWidth = 5;
    ctx.moveTo(2, 10);
    ctx.lineTo(2, 2);
    ctx.lineTo(10, 2);
    ctx.moveTo(2, 2);
    ctx.lineTo(30, 30)    
    ctx.stroke();

    return {cursor: 'url(' + cursor.toDataURL() + '), auto'}
}

export default IndexPage