function Unauthorized() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Unauthorized</h2>
        <p>You do not have access to this page. Please log in first.</p>
      </div>
    </div>
  );
}

export default Unauthorized;
