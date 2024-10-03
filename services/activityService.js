const activityRepository = require('../repositories/activityRepository');

const clubGroups = {
  1: 'Sporty',
  2: 'Cultural',
  3: 'Adventure',
};

exports.getUpcomingMeetups = async (clubId) => {
    const activities = await activityRepository.findUpcomingMeetups(clubId);

    const updatedActivities = await Promise.all(activities.map(async (activity) => {
        const admins = await activityRepository.findAdminsByAdminIds(activity.admin_ids);
        const members = await activityRepository.findMembersByActivityId(activity.activity_id);
        
        return {
            ...activity,
            admins: admins,
            members: members
        };
    }));

    return updatedActivities;
};


exports.getClubInfo = async (clubId) => {
    const club = await activityRepository.findClubById(clubId);
    if (!club) throw new Error('Club not found');

    const admins = await activityRepository.getAdminsByIds(club.admin_ids);
    const members = await activityRepository.getMembersByClubId(clubId);

    const totalMembers = members.length;

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const activeMembers = members.filter(member => 
      new Date(member.joined_on) >= oneMonthAgo
    );

    return {
      club,
      admins,
      totalMembers,
      activeMembers: activeMembers.length,
      activeMembersDetails: await activityRepository.getMemberDetails(activeMembers.map(m => m.member_id)),
      activityTag: await activityRepository.getActivityTag(club.activity_tag_id),
    };
  }

exports.getClubsByLocation = async (locationId) => {
  try {
    const clubs = await activityRepository.findClubsByLocation(locationId);

    const enhancedClubs = await Promise.all(
      clubs.map(async (club) => {
        const activityTag = await activityRepository.getActivityTagById(club.activity_tag_id);

        const meetupDaysSet = new Set();

        // If meetup_info exists, process it
        if (club.meetup_info) {
          const meetupInfoArray = club.meetup_info;
          
          // Loop through each meetup info object to gather meetup_days
          meetupInfoArray.forEach(meetup => {
            const days = JSON.parse(meetup.meetup_days);
            days.forEach(day => meetupDaysSet.add(day));
          });
        }

        // Assign the aggregated unique meetup_days back to the club object
        club.meetup_days = Array.from(meetupDaysSet);

        // Assign activity type and group based on the fetched activity tag
        club.activityType = activityTag ? activityTag.name : null;
        club.activityGroup = activityTag ? clubGroups[activityTag.group_id] : null;

        return club;
      })
    );

    return enhancedClubs;
  } catch (error) {
    throw new Error('Error fetching clubs information');
  }
};
