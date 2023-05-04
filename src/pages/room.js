import { withRouter } from 'next/router'
import { QRCode } from 'react-qrcode-logo';

export default withRouter((props) => {
    const { code } = props.router.query
    return (
        <div>
            <main>
                <h1>Essa é a sala: {code}</h1>
                <QRCode value={`quiz-maker.herokuapp.com/room?code=${code}`} ecLevel='H' qrStyle='dots' logoImage='quiz-time-logo.png' logoWidth={80} logoOpacity={0.5} eyeColor={{ outer: '#00a0dc', inner: '#005270' }} eyeRadius={5}/>
            </main>
        </div>
    );
})