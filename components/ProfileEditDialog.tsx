import { useState, useRef, useEffect } from "react";
import { User, Mail, Phone, BookOpen, Calendar, Camera, Upload, X, History, MapPin, GraduationCap, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { UserProfile } from "../utils/supabase/database";

interface LoginHistory {
  date: string;
  time: string;
  device: string;
  location: string;
}

// Extended profile interface for form data
interface ExtendedUserProfile extends UserProfile {
  campus?: string;
  academicYear?: string;
  admissionYear?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
}

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export function ProfileEditDialog({ isOpen, onClose, userProfile, onSave }: ProfileEditDialogProps) {
  const [formData, setFormData] = useState<ExtendedUserProfile>(userProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock login history data
  const [loginHistory] = useState<LoginHistory[]>([
    {
      date: "17/10/25",
      time: "05:15 PM",
      device: "Chrome Browser",
      location: "Pilani, Rajasthan"
    },
    {
      date: "16/10/25",
      time: "08:30 AM",
      device: "Mobile App",
      location: "Pilani, Rajasthan"
    },
    {
      date: "15/10/25",
      time: "02:45 PM",
      device: "Chrome Browser",
      location: "Pilani, Rajasthan"
    },
    {
      date: "14/10/25",
      time: "11:20 AM",
      device: "Safari Browser",
      location: "Pilani, Rajasthan"
    },
    {
      date: "13/10/25",
      time: "07:15 PM",
      device: "Chrome Browser",
      location: "Pilani, Rajasthan"
    }
  ]);

  // Update formData when userProfile changes
  useEffect(() => {
    setFormData({
      ...userProfile,
      campus: 'BITS Pilani',
      academicYear: '2024-25',
      admissionYear: '2021',
      dateOfBirth: '',
      address: '',
      emergencyContact: ''
    });
  }, [userProfile]);

  // Reset states when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setShowSuccessMessage(false);
      setUploadError("");
      setIsUploading(false);
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof ExtendedUserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    console.log("Saving profile data:", formData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Convert extended profile back to UserProfile for saving
    const userProfileData: UserProfile = {
      id: formData.id,
      student_id: formData.student_id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      course: formData.course,
      semester: formData.semester,
      avatar: formData.avatar
    };
    onSave(userProfileData);
    setIsLoading(false);
  };

  const handleCancel = () => {
    setFormData(userProfile); // Reset form data
    setUploadError(""); // Clear any upload errors
    onClose();
  };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const updatedFormData = { ...formData, avatar: result };
        setFormData(updatedFormData);
        setIsUploading(false);
        
        // Auto-save the profile picture immediately
        console.log("Auto-saving profile with new avatar:", updatedFormData);
        
        // Convert to UserProfile format for saving
        const userProfileData: UserProfile = {
          id: updatedFormData.id,
          student_id: updatedFormData.student_id,
          name: updatedFormData.name,
          email: updatedFormData.email,
          phone: updatedFormData.phone,
          course: updatedFormData.course,
          semester: updatedFormData.semester,
          avatar: updatedFormData.avatar
        };
        onSave(userProfileData);
        
        // Show success message for 3 seconds
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploadError("Failed to upload image");
      setIsUploading(false);
    }
  };

  const triggerImageUpload = () => {
    if (isUploading) return; // Prevent multiple uploads
    fileInputRef.current?.click();
  };

  const removeProfilePicture = () => {
    setFormData(prev => ({ ...prev, avatar: "" }));
    setUploadError("");
  };

  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#191f5e] dark:text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Update your personal information and academic details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                              <Avatar className="w-24 h-24 cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-200">
                  <AvatarImage 
                    src={formData.avatar} 
                    alt="Profile" 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-semibold border-0">
                    {formData.name ? formData.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2) : 'U'}
                  </AvatarFallback>
                </Avatar>
              
              {/* Upload Button */}
              <Button
                type="button"
                size="sm"
                onClick={triggerImageUpload}
                disabled={isUploading}
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-[#191f5e] hover:bg-[#2d3748] text-white disabled:opacity-50"
                title="Change profile picture"
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
              </Button>

              {/* Remove Button (only show if there's an avatar) */}
              {formData.avatar && (
                <Button
                  type="button"
                  size="sm"
                  onClick={removeProfilePicture}
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0 bg-red-500 hover:bg-red-600 text-white border-2 border-white"
                  title="Remove profile picture"
                >
                  <X className="w-3 h-3 text-white" />
                </Button>
              )}
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Click the camera icon to change profile picture
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supported formats: PNG, JPG, GIF, WebP (max 5MB)
              </p>
              
              {/* Upload Error */}
              {uploadError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-600">{uploadError}</p>
                </div>
              )}
              
              {/* Upload Success */}
              {showSuccessMessage && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-xs text-green-600">Profile picture updated successfully!</p>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#191f5e] dark:text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-[#191f5e] dark:focus:border-blue-400"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="id" className="text-[#191f5e] dark:text-white">
                Student ID
              </Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-[#191f5e] dark:focus:border-blue-400"
                placeholder="Your student ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#191f5e] dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-[#191f5e] dark:focus:border-blue-400"
                placeholder="your.email@pilani.bits-pilani.ac.in"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#191f5e] dark:text-white flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-[#191f5e] dark:focus:border-blue-400"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course" className="text-[#191f5e] dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Course
              </Label>
              <Select
                value={formData.course}
                onValueChange={(value) => handleInputChange('course', value)}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B.Tech Computer Science">B.Tech Computer Science</SelectItem>
                  <SelectItem value="M.Tech Computer Science">M.Tech Computer Science</SelectItem>
                  <SelectItem value="B.Tech Electronics & Instrumentation">B.Tech Electronics & Instrumentation</SelectItem>
                  <SelectItem value="M.Tech Electronics & Instrumentation">M.Tech Electronics & Instrumentation</SelectItem>
                  <SelectItem value="B.Tech Mechanical Engineering">B.Tech Mechanical Engineering</SelectItem>
                  <SelectItem value="M.Tech Mechanical Engineering">M.Tech Mechanical Engineering</SelectItem>
                  <SelectItem value="B.Tech Chemical Engineering">B.Tech Chemical Engineering</SelectItem>
                  <SelectItem value="M.Tech Chemical Engineering">M.Tech Chemical Engineering</SelectItem>
                  <SelectItem value="B.Tech Civil Engineering">B.Tech Civil Engineering</SelectItem>
                  <SelectItem value="M.Tech Civil Engineering">M.Tech Civil Engineering</SelectItem>
                  <SelectItem value="B.E. Biotechnology">B.E. Biotechnology</SelectItem>
                  <SelectItem value="M.Tech Biotechnology">M.Tech Biotechnology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester" className="text-[#191f5e] dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Current Semester
              </Label>
              <Select
                value={formData.semester}
                onValueChange={(value) => handleInputChange('semester', value)}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Semester">1st Semester</SelectItem>
                  <SelectItem value="2nd Semester">2nd Semester</SelectItem>
                  <SelectItem value="3rd Semester">3rd Semester</SelectItem>
                  <SelectItem value="4th Semester">4th Semester</SelectItem>
                  <SelectItem value="5th Semester">5th Semester</SelectItem>
                  <SelectItem value="6th Semester">6th Semester</SelectItem>
                  <SelectItem value="7th Semester">7th Semester</SelectItem>
                  <SelectItem value="8th Semester">8th Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t border-university-border pt-4">
            <h3 className="text-lg font-medium text-[#191f5e] dark:text-white mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campus" className="text-[#191f5e] dark:text-white">Campus</Label>
                <Select
                  value={formData.campus || 'BITS Pilani'}
                  onValueChange={(value) => handleInputChange('campus', value)}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Select campus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BITS Pilani">BITS Pilani, Rajasthan</SelectItem>
                    <SelectItem value="BITS Goa">BITS Goa</SelectItem>
                    <SelectItem value="BITS Hyderabad">BITS Hyderabad</SelectItem>
                    <SelectItem value="BITS Dubai">BITS Dubai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicYear" className="text-[#191f5e] dark:text-white">Academic Year</Label>
                <Select
                  value={formData.academicYear || '2024-25'}
                  onValueChange={(value) => handleInputChange('academicYear', value)}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2021-25">2021-25</SelectItem>
                    <SelectItem value="2022-26">2022-26</SelectItem>
                    <SelectItem value="2023-27">2023-27</SelectItem>
                    <SelectItem value="2024-28">2024-28</SelectItem>
                    <SelectItem value="2025-29">2025-29</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-university-border">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 bg-[#191f5e] hover:bg-[#2d3748] text-white hover:text-white disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}