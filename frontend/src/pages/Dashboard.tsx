import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface Space {
  id: string;
  spaceName: string;
  headerTitle: string;
  customMessage: string;
  question1: string;
  question2: string;
  question3: string;
}

const Dashboard = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const navigate = useNavigate();

  const fetchSpaces = async () => {
    try {
      const response = await fetch("http://localhost:3000/space");
      const data = await response.json();
      setSpaces(data);
      console.log(data);
    } catch (error) {
      console.log("Error fetching spaces:", error);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 px-52 py-28">
      <div className="text-white text-4xl font-bold">Overview</div>
      <div className="flex mt-8 gap-4">
        <div className="bg-gray-700 p-4 w-1/3 rounded-lg">
          <div className="flex justify-between">
            <div className="text-white text-xl">Total videos</div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="h-5 w-5 text-gray-400 "
            >
              <path
                stroke-linecap="round"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              ></path>
            </svg>
          </div>
          <div className="mt-4 text-white text-xl">0/2</div>
        </div>
        <div className="bg-gray-700 p-4 w-1/3 rounded-lg">
          <div className="flex justify-between">
            <div className="text-white text-xl">Total Spaces</div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="h-5 w-5 text-gray-600 dark:text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              ></path>
            </svg>
          </div>
          <div className="mt-4 text-white text-xl">0/2</div>
        </div>
      </div>

      <div className="mt-16 w-full flex flex-col items-center">
        <div className="text-white text-4xl font-bold">Spaces</div>
        <div className="bg-gray-700 mt-8 py-12 p-4 rounded-lg grid grid-cols-3 gap-4 w-full">
          {spaces.length > 0 ? (
            spaces.map((space: Space) => (
              <div
                key={space.id}
                className="bg-gray-800 p-6 rounded-lg mt-4 w-full h-32 flex flex-col justify-between"
              >
                <div className="flex justify-between">
                  <Link
                    to={`/space/${space.spaceName}`}
                    className="text-white text-xl"
                  >
                    {space.spaceName}
                  </Link>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                    />
                  </svg>
                </div>
                <div className="flex justify-between text-white">
                  <div>Total videos: 0</div>
                  <div>Total Texts: 0</div>
                </div>
              </div>
            ))
          ) : (
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="w-12 h-12 mx-auto text-gray-400 mb-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                ></path>
              </svg>
              <div className="text-white text-2xl text-center font-semibold">
                No Spaces Yet
              </div>
              <div className="text-white text-lg text-center">
                Create your first space to start collecting testimonials
              </div>
            </div>
          )}
        </div>
        <button
          onClick={
            () => navigate("/create-space") // Adjust the route as needed
          }
          className="w-64 mt-8 px-8 py-4 bg-blue-700 text-white font-bold rounded-lg shadow-lg "
        >
          + Create Space
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
