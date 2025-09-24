import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Send, Loader2 } from 'lucide-react';
import { applicationsApi } from '@/lib/api-client';
import { ApplicationData, ApplyModalProps } from '@/types/interface';


const ApplyModal: React.FC<ApplyModalProps> = ({ internship, isOpen, onClose }) => {
  const [coverLetter, setCoverLetter] = useState<string>('');
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: applicationsApi.create,
    onSuccess: (data: any) => {
      // Show success message
      alert('Application submitted successfully!');
      
      // Invalidate queries to update UI
      queryClient.invalidateQueries({ queryKey: ['internship-status', internship.id] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      
      // Close modal and reset form
      onClose();
      setCoverLetter('');
    },
    onError: (error: any) => {
      // Handle error
      const message = error?.response?.data?.message || 'Failed to submit application';
      alert(message);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    const applicationData: ApplicationData = {
      internshipId: internship.id,
      coverLetter: coverLetter.trim() || undefined
    };

    applyMutation.mutate(applicationData);
  };

  const handleClose = (): void => {
    if (!applyMutation.isPending) {
      setCoverLetter('');
      onClose();
    }
  };

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setCoverLetter(e.target.value);
  };

  if (!isOpen) return null;

  const companyName = typeof internship.company === 'string' 
    ? internship.company 
    : internship.company?.companyName;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Apply for Position</h2>
            <p className="text-gray-600 mt-1">
              {internship.title} at {companyName}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={applyMutation.isPending}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label 
              htmlFor="coverLetter" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cover Letter (Optional)
            </label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={handleCoverLetterChange}
              rows={8}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Tell the company why you're interested in this internship and what makes you a great fit..."
              disabled={applyMutation.isPending}
            />
            <p className="text-sm text-gray-500 mt-2">
              {coverLetter.length}/1000 characters
            </p>
          </div>

          {/* Application Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Application Details</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Your application will be sent directly to {companyName}</p>
              <p>• You can track your application status in your dashboard</p>
              <p>• Make sure your profile is complete before applying</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={applyMutation.isPending}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={applyMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {applyMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;