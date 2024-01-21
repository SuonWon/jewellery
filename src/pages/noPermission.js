function NoPermission() {
    return (
        <div
            className="flex items-center justify-center w-screen h-screen bg-gradient-to-r from-white to-gray-100"
        >
            <div class="px-40 py-20 bg-white rounded-lg shadow-xl">
                <div class="flex flex-col items-center">
                    <h1 class="font-bold text-purple-700 text-9xl">403</h1>
                    <h6 class="mb-2 text-2xl font-bold uppercase text-center text-gray-800 md:text-3xl">
                        <span class="text-red-500 capitalize">Oops!</span> Access Forbidden
                    </h6>
                    <p class="mb-8 text-center text-gray-500 md:text-lg">I'm sorry buddy.</p>
                </div>
            </div>
        </div>
    );
}

export default NoPermission;