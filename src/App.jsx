
import React from "react"

function App() {  

  return (
    <div className="container-fluid p-0">

      <div className="container-fluid bg-primary">
        <div className="row">
          <div className="col">
            <h2 className="pt-2 text-light align-middle">Tealo</h2>
          </div>
          <div className="col">
            <button className="btn btn-primary float-end mt-1 mb-1 pt-1 ps-2 pe-2">
              <svg onClick={() => window.open('https://github.com/ThijmenGThN/Tealo')} width="22" height="22" fill="white" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <ul className="list-group mt-3">
          <li className="list-group-item">
            <div className="row">
              <div className="col">
                25604OSLD0 (SD 1 - Deventer)
              </div>
              <div className="col">
                <button className="btn btn-primary float-end h-100">
                  Selecteren
                </button>
              </div>
            </div>
          </li>
        </ul>
        <button className="btn btn-secondary w-100 mt-3">
          Klas aanvragen
        </button>
        <p className="text-center mt-3">Automatisch een Trello board bijwerken met Tealo, simpel en snel.</p>
      </div>

    </div>
  )

}

export default App
