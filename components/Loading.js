
const Loading = ({ message }) => {
    return (
        <div className='fixed inset-0 flex flex-col items-center justify-center space-y-1 bg-white cursor-auto z-50'>
                <div className="w-12 h-12 mx-auto animate-spin">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" className="w-full h-auto stroke-red-500 animate-spine">
                        <circle
                            className="stroke-red-900 fill-red-900"
                            cx="15.022099"
                            cy="4.0108786"
                            r="2.0275335" />
                        <circle
                            className="stroke-red-800 fill-red-800"
                            cx="9.6043911"
                            cy="5.5399179"
                            r="1.8694704" />
                        <circle
                            className="stroke-red-700 fill-red-700"
                            cx="5.5693841"
                            cy="9.4559107"
                            r="1.718169" />
                        <circle
                            className="stroke-red-600 fill-red-600"
                            cx="4.1392002"
                            cy="14.976233"
                            r="1.5767351" />
                        <circle
                            className="stroke-red-500 fill-red-500"
                            cx="5.5038867"
                            cy="20.530016"
                            r="1.4256971" />
                        <circle
                            className="stroke-red-400 fill-red-400"
                            cx="9.5552845"
                            cy="24.433014"
                            r="1.2682805" />
                        <circle
                            className="stroke-red-300 fill-red-300"
                            cx="15.012089"
                            cy="25.918406"
                            r="1.1046549" />
                        <circle
                            className="stroke-red-200 fill-red-200"
                            cx="20.524843"
                            cy="24.490162"
                            r="0.93497014" />
                        <circle
                            className="stroke-red-100 fill-red-100"
                            cx="24.555962"
                            cy="20.432346"
                            r="0.74646348" />
                        <circle
                            className="stroke-red-50 fill-red-50"
                            cx="25.997553"
                            cy="14.993498"
                            r="0.56564623" />
                        <circle
                            className="stroke-red-50 fill-red-50"
                            cx="24.541632"
                            cy="9.5103636"
                            r="0.39946598" />
                        <circle
                            className="stroke-red-50 fill-red-50"
                            cx="20.517679"
                            cy="5.4785972"
                            r="0.25500405" />
                    </svg>
                </div>



                <p className='w-fit text-center text-sx'>{message} <span className='animate-ping'>...</span></p>
        </div>
    )
}
export default Loading;
