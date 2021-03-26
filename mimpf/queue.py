def waiting_time_priority(waiting_time_diff: int):
    """
    calculate the priority (0 to 1, lower = better) according
    to the waiting time (in minutes).
    """
    if waiting_time_diff < 0:
        raise ValueError("waiting time cannot be negative")

    elif waiting_time_diff < 15:
        return (-0.25 / 15) * waiting_time_diff + 1

    elif waiting_time_diff < 15:
        return (-0.75 / 30) * waiting_time_diff + 0.75

    else:
        return 0


def target_date_priority(target_date_diff: int):
    """
    calculate the priority (0 to 1, lower = better) according
    to the difference to target date (in minutes).
    """
    if target_date_diff < -25:
        return 1
    elif target_date_diff < -5:
        return (-1 / 20) * target_date_diff + 1
    elif target_date_diff < 15:
        return 0
    else:
        return 0.5


def punctuality_priority(arrival_date_diff: int):
    """
    calculate the priority (0 to 1, lower = better) according
    to the punctuality (target date minus arrival date) in minutes.
    """
    if arrival_date_diff < -15:
        return 1
    elif arrival_date_diff < -5:
        return (-1 / 10) * arrival_date_diff + 1
    elif arrival_date_diff < 5:
        return 0
    elif arrival_date_diff < 10:
        return (1 / 5) * arrival_date_diff
    else:
        return 1


def calculate_priority(waiting_time_diff: int, target_date_diff: int, arrival_date_diff: int):
    """
    calculate the priority of an appointment based on
    waiting time (minutes), difference to target date (minutes), punctuality (minutes).
    """
    return (target_date_priority(target_date_diff) + waiting_time_priority(waiting_time_diff) \
            + punctuality_priority(arrival_date_diff)) / 3
