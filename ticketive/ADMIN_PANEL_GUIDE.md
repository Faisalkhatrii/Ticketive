# 🔧 Ticketive Admin Panel Guide

The Ticketive admin panel provides comprehensive management capabilities for the entire booking system. Here's everything you need to know about accessing and using the admin panel.

## 🚀 **Quick Access**

### **Admin Login Credentials**
- **URL**: `http://localhost:8000/admin/`
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@ticketive.com`

## 📊 **Dashboard Overview**

The admin dashboard provides real-time analytics and statistics:

### **Key Metrics Displayed**
- 📈 **Total Bookings**: Overall booking count
- ✅ **Completed Bookings**: Successfully paid bookings
- ⏳ **Pending Payments**: Bookings awaiting payment
- 💰 **Total Revenue**: Sum of all completed booking amounts
- 🚂 **Train Bookings**: Train-specific booking count
- 🚌 **Bus Bookings**: Bus-specific booking count

## 🎛️ **Admin Panel Features**

### **1. User Management** 
- **Custom User Model** with additional fields
- **User Registration Data**: Phone number, date of birth
- **User Activity Tracking**: Login history and booking behavior
- **Search & Filter**: Find users by username, email, name

### **2. Train Management**

#### **Train Administration**
- ✅ **Add/Edit Trains**: Complete train information
- 🎯 **Route Management**: Source and destination cities
- ⏰ **Schedule Management**: Departure and arrival times
- 💺 **Coach Management**: Multiple coach types per train
- 📊 **Revenue Tracking**: Per-train revenue analytics

#### **Train Coach Management**
- 🎨 **Color-coded Coach Types**:
  - 🟢 Sleeper Class (Green)
  - 🔵 3A Tier AC Coach (Blue)
  - 🟡 2A Tier AC Coach (Yellow)
  - 🔴 1A Tier AC Coach (Red)
- 📈 **Occupancy Display**: Visual occupancy percentage
- 💰 **Pricing Management**: Per-seat pricing
- 📊 **Revenue Analytics**: Coach-wise revenue tracking

### **3. Bus Management**

#### **Bus Administration**
- ✅ **Add/Edit Buses**: Complete bus information
- 🎯 **Route Management**: Source and destination cities
- ⏰ **Schedule Management**: Departure and arrival times
- 💺 **Seat Management**: 40-seat configuration per bus
- 📊 **Revenue Tracking**: Per-bus revenue analytics

#### **Bus Seat Management**
- 🎨 **Visual Status Indicators**:
  - 🟢 **AVAILABLE** (Green)
  - 🔴 **BOOKED** (Red)
- 🔍 **Seat Tracking**: Individual seat booking status
- 📊 **Occupancy Analytics**: Real-time seat availability

### **4. Booking Management**

#### **Advanced Booking Administration**
- 🎫 **Booking Overview**: Complete booking information
- 👥 **User Information**: Customer details with contact info
- 🎨 **Type Indicators**:
  - 🔵 **TRAIN** (Blue)
  - 🟢 **BUS** (Green)
- 💳 **Payment Status Tracking**:
  - 🟢 **COMPLETED** (Green)
  - 🟡 **PENDING** (Yellow)
  - 🔴 **FAILED** (Red)

#### **Payment Management**
- 📸 **Screenshot Preview**: View uploaded payment proofs
- 🔍 **Payment Verification**: Manual payment status updates
- 💰 **Amount Tracking**: Platform fees and total amounts
- 📅 **Date Hierarchy**: Filter by booking dates

#### **Passenger Management**
- 👤 **Passenger Details**: Name, age, gender information
- 💺 **Seat Assignments**: Seat numbers for each passenger
- 🔗 **Booking Links**: Direct links to related bookings
- 🔍 **Advanced Search**: Find passengers across all bookings

## 🛠️ **Advanced Features**

### **1. Inline Editing**
- **Train Coaches**: Edit coaches directly from train page
- **Bus Seats**: Manage seats from bus administration
- **Passengers**: Add/edit passengers from booking page

### **2. Bulk Operations**
- **Mass Updates**: Update multiple records simultaneously
- **Bulk Delete**: Remove multiple entries at once
- **Export Data**: Download data in various formats

### **3. Search & Filtering**
- 🔍 **Global Search**: Search across all models
- 🎯 **Advanced Filters**: Filter by multiple criteria
- 📅 **Date Range Filtering**: Filter by date ranges
- 📊 **Status Filtering**: Filter by payment/booking status

### **4. Analytics & Reporting**
- 📈 **Revenue Analytics**: Track earnings by service type
- 📊 **Occupancy Reports**: Monitor seat utilization
- 👥 **User Analytics**: Customer behavior insights
- 📅 **Booking Trends**: Daily/weekly/monthly trends

## 🎨 **Visual Enhancements**

### **Color-Coded Status System**
- **Payment Status**: Green (Completed), Yellow (Pending), Red (Failed)
- **Booking Types**: Blue (Train), Green (Bus)
- **Coach Types**: Different colors for each class
- **Seat Status**: Green (Available), Red (Booked)

### **Rich Data Display**
- **Route Visualization**: Source → Destination format
- **Occupancy Bars**: Visual percentage indicators
- **Revenue Formatting**: Currency formatting with commas
- **User Information**: Name and email in formatted display

## 📱 **Mobile Responsiveness**

The admin panel is fully responsive and works on:
- 💻 **Desktop Computers**
- 📱 **Tablets**
- 📱 **Mobile Devices**

## 🔐 **Security Features**

### **Access Control**
- **Superuser Authentication**: Secure admin access
- **Permission System**: Role-based access control
- **Session Management**: Automatic logout for security
- **CSRF Protection**: Built-in security measures

### **Data Protection**
- **Readonly Fields**: Prevent accidental modifications
- **Audit Trail**: Track changes with timestamps
- **Secure File Uploads**: Safe payment screenshot handling

## 📋 **Common Admin Tasks**

### **Daily Operations**
1. **Check Pending Payments**: Review and verify payments
2. **Monitor Bookings**: Track new reservations
3. **Update Availability**: Adjust seat/coach availability
4. **Customer Support**: Access customer booking details

### **Weekly Operations**
1. **Revenue Analysis**: Review weekly earnings
2. **Occupancy Reports**: Analyze utilization rates
3. **User Activity**: Monitor customer engagement
4. **System Maintenance**: Update routes and schedules

### **Monthly Operations**
1. **Performance Reports**: Generate monthly analytics
2. **Route Optimization**: Analyze popular routes
3. **Pricing Updates**: Adjust pricing strategies
4. **System Updates**: Maintain and update data

## 🆘 **Troubleshooting**

### **Common Issues**
- **Login Problems**: Check credentials and browser cache
- **Slow Loading**: Clear browser cache and cookies
- **Display Issues**: Ensure JavaScript is enabled
- **Upload Problems**: Check file size and format limits

### **Support Information**
- **File Upload Limit**: 5MB maximum for payment screenshots
- **Supported Formats**: JPG, PNG, GIF for images
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Session Timeout**: 2 hours of inactivity

## 🎯 **Best Practices**

### **Data Management**
- ✅ Regular backup of important data
- ✅ Verify payment screenshots before approval
- ✅ Keep route information updated
- ✅ Monitor system performance regularly

### **User Experience**
- ✅ Respond to customer queries promptly
- ✅ Keep booking information accurate
- ✅ Update availability in real-time
- ✅ Maintain clean and organized data

## 📈 **Advanced Analytics**

The admin panel provides detailed analytics for:
- **Revenue Tracking**: Daily, weekly, monthly revenue
- **Booking Patterns**: Peak booking times and routes
- **Customer Insights**: User behavior and preferences
- **Operational Metrics**: System performance indicators

---

## 🎉 **Getting Started**

1. **Access Admin Panel**: Navigate to `http://localhost:8000/admin/`
2. **Login**: Use credentials provided above
3. **Explore Dashboard**: Review the analytics overview
4. **Manage Data**: Use the navigation menu to access different sections
5. **Monitor Operations**: Keep track of bookings and payments

The Ticketive admin panel is designed to provide comprehensive control over your booking system while maintaining ease of use and powerful functionality! 🚀