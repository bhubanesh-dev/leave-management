
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[90dvh] w-full flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-2xl mb-6 text-gray-700">Page Not Found</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Go Home
      </button>
    </div>
  )
}

export default PageNotFound;