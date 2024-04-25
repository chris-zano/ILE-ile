#include <node.h>

#define DAYS 5
#define HOURS 8

using namespace v8;

typedef struct {
    int day;
    int hour;
    int occupied;
} TimeSlot;

TimeSlot timeslots[DAYS][HOURS];

void initializeTimeSlots() {
    for (int day = 0; day < DAYS; day++) {
        for (int hour = 0; hour < HOURS; hour++) {
            timeslots[day][hour].day = day;
            timeslots[day][hour].hour = hour + 8; // Start from 8 am
            timeslots[day][hour].occupied = 0; // Initially not occupied
        }
    }
}

// Method to set a timeslot as occupied
void setTimeslotOccupied(int day, int hour) {
    if (day >= 0 && day < DAYS && hour >= 0 && hour < HOURS) {
        timeslots[day][hour].occupied = 1;
        printf("Timeslot (%d, %d) marked as occupied.\n", day, hour);
    } else {
        printf("Invalid day or hour.\n");
    }
}

// Exported function to be called from Node.js
void markTimeslotOccupied(int day, int hour) {
    setTimeslotOccupied(day, hour);
}

// Exported function to get the status of a timeslot
int isTimeslotOccupied(int day, int hour) {
    if (day >= 0 && day < DAYS && hour >= 0 && hour < HOURS) {
        return timeslots[day][hour].occupied;
    } else {
        printf("Invalid day or hour.\n");
        return -1; // Error code indicating invalid input
    }
}

void scheduleMaker(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    // Your C code logic here
}

void Initialize(Local<Object> exports) {
    NODE_SET_METHOD(exports, "scheduleMaker", scheduleMaker);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
