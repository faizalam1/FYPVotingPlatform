const NotFound = () => {

    return (
        <div className="flex flex-col items-center justify-center flex-grow">
            <h1 className="text-4xl font-bold text-center">404</h1>
            <h2 className="text-2xl font-semibold text-center">Page Not Found</h2>
            <a href="./">
                <p className="text-blue-500 hover:underline">Go back to previous page</p>
            </a>
        </div>
    )
}

export default NotFound