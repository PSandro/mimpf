def waiting_time_priority(waiting_time_diff: int):
    """
    calculate the priority (0 to 1, lower = better) according
    to the waiting time (in minutes).
    """
    if waiting_time_diff < 0:
        raise ValueError("waiting time cannot be negative")

    elif waiting_time_diff < 15:
        return (-0.25 / 15) * waiting_time_diff + 1

    elif waiting_time_diff < 45:
        return (-0.75 / 30) * (waiting_time_diff - 15) + 0.75

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
        return (-1 / 20) * (target_date_diff + 25) + 1
    elif target_date_diff < 15:
        return 0
    else:
        return 0.25


def punctuality_priority(arrival_date_diff: int):
    """
    calculate the priority (0 to 1, lower = better) according
    to the punctuality (target date minus arrival date) in minutes.
    """
    if arrival_date_diff < -15:
        return 1
    elif arrival_date_diff < -5:
        return (-1 / 10) * (arrival_date_diff + 15) + 1
    elif arrival_date_diff < 5:
        return 0
    elif arrival_date_diff < 10:
        return (1 / 5) * (arrival_date_diff - 5)
    else:
        return 1


def weight_priorities(waiting_time_prio: int, target_date_prio: int, punctuality_prio: int):
    return (2 * waiting_time_prio + 3 * target_date_prio + punctuality_prio) / 6
