import React from "react";



export const BtnEn = ({ Title, Click, Class }) => {
  return (
    <button onClick={Click} className={`text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 ${Class} cursor-pointer`}>{Title}</button>

  )
}


export const BtnInput = ({ Title, Click, Class }) => {
  return (
    <input type="button" onClick={Click} className={`text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 ${Class} cursor-pointer`} value={Title} />
  )
}



export const BtnEnSm = ({ Title, Click, Class }) => {
  return (
    <button onClick={Click} className={`text-center mt-3 mx-0.5 px-4 py-2 text-sm font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 text-white ${Class}`}>{Title}</button>
  )
}


export const BtnSubmit = ({ Title, Class }) => {
  return (
    <button type="submit" className={`text-center mt-3 mx-0.5 px-4 py-2 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 ${Class}`}>{Title}</button>
  )
}

export const BtnSubmitSm = ({ Title, Class }) => {
  return (
    <button type="submit" className={`text-xs text-center mx-0.5 px-2 py-0.5 font-semibold rounded-md focus:ring-1 ring-blue-200 ring-offset-2 duration-300 ${Class}`}>{Title}</button>
  )
}

//---------------------------------------------------------------------


export const TextEn = ({ Title, Id, Change, Value, Chr }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <input onChange={Change} value={Value} type="text" id={Id} name={Id} required className="w-full px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" maxLength={Chr} />
    </div>
  )
}

export const TextBn = ({ Title, Id, Change, Value, Chr }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <input onChange={Change} value={Value} type="text" id={Id} name={Id} required maxLength={Chr} className="w-full px-4 py-1.5 font-sutonnyN text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
    </div>
  )
}


export const TextUn = ({ Title, Id, Change, Value, Chr }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <input onChange={Change} value={Value} type="text" id={Id} name={Id} required maxLength={Chr} className={`w-full px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300`} />
    </div>
  )
}

//----------------------------------------------------------------------------


export const TextEnDisabled = ({ Title, Id, Change, Value, Chr }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <input onChange={Change} value={Value} type="text" id={Id} name={Id} required maxLength={Chr} disabled className="w-full px-4 py-1.5 text-gray-600 bg-gray-300 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
    </div>
  )
}

export const TextBnDisabled = ({ Title, Id, Change, Value, Chr }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <input onChange={Change} value={Value} type="text" id={Id} name={Id} required maxLength={Chr} disabled className="w-full px-4 py-1.5 font-sutonnyN text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
    </div>
  )
}

//-------------------------------------------------------------------------------


export const TextPw = ({ Title, Id, Change, Value, Chr }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <input onChange={Change} value={Value} type="password" id={Id} name={Id} required className="w-full px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" maxLength={Chr} />
    </div>
  )
}



export const TextDt = ({ Title, Id, Change, Value }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <input onChange={Change} value={Value} type="date" id={Id} name={Id} required className="w-full px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
    </div>
  )
}


export const TextTm = ({ Title, Id, Change, Value }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <input onChange={Change} value={Value} type="time" id={Id} name={Id} required className="w-full px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
    </div>
  )
}



export const TextNum = ({ Title, Id, Change, Value }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <input onChange={Change} value={Value} type="number" id={Id} name={Id} className="w-full px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" min="-999999999999" step="0.01" max="999999999999" required />
    </div>
  )
}



export const TextFile = ({ Title, Id, Change, Accept, Class }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className={`text-xs font-semibold mb-1 ${Class} opacity-50`} htmlFor={Id}>{Title}</label>
      <input onChange={Change} type="file" id={Id} name={Id} required className="w-full px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" accept={Accept} />
    </div>
  )
}


//-----------------------------------------------------------------------------

export const DropdownEn = ({ children, Title, Id, Change, Value }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <select onChange={Change} value={Value} id={Id} name={Id} required className="w-full px-4 py-1.5  text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300">
        <option value="">---</option>
        {children}
      </select>
    </div>
  )
}


export const DropdownBn = ({ children, Title, Id, Change, Value }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <select onChange={Change} value={Value} id={Id} name={Id} required className="w-full px-4 py-1.5  font-sutonnyN text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300">
        {children}
      </select>
    </div>
  )
}

//----------------------------------------------------------------------------


export const TextareaEn = ({ Title, Id, Rows, Change, Value }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <textarea rows={Rows} id={Id} name={Id} onChange={Change} value={Value} maxLength={2000} className="w-full px-4 py-1.5 text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
    </div>
  )
}


export const TextareaBn = ({ Title, Id, Rows, Change, Value }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <textarea rows={Rows} onChange={Change} value={Value} id={Id} name={Id} maxLength={400} className="w-full px-4 py-1.5 font-sutonnyN text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
    </div>
  )
}


export const TextareaUn = ({ Title, Id, Rows, Change, Value }) => {
  return (
    <div className="w-full flex flex-col items-start">
      <label className='text-xs font-semibold mb-1 opacity-50' htmlFor={Id}>{Title}</label>
      <textarea rows={Rows} onChange={Change} value={Value} id={Id} name={Id} maxLength={400} className="w-full px-4 py-1.5 font-tiroN text-gray-600 ring-1 focus:ring-4 ring-blue-300 outline-none rounded duration-300" />
    </div>
  )
}

