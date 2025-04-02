const LoadingDot = ({ message }) => {
    return (
        <div className='fixed inset-0 flex flex-col items-center justify-center space-y-2 bg-white cursor-auto z-50'>
                <div className="w-4 h-4 lg:w-5 lg:h-5 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#000000ff" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-full h-full p-0.5 stroke-black animate-ping ring-4 ring-offset-1 ring-gray-200  rounded-full">
                        <circle cx="12" cy="12" r="11" />
                    </svg>
                </div>



                <p className='w-fit text-center text-sx lg:text-lg'>{message} <span className='animate-ping'>...</span></p>
        </div>
    )
}
export default LoadingDot;
