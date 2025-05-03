export default function PostPreview() {
    return (
        <div className="border-4 border-[#012D5A] rounded-2xl shadow-lg p-6 bg-white max-w-xl mx-auto my-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-[#012D5A]">Title</h2>
                <p className="text-sm text-gray-500">Created at time by User / Email</p>
                <div className="text-gray-700">
                    Content preview
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-600">Number of replies</h3>
            </div>
        </div>
    );
}
